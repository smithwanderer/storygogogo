import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FiX, FiHeart, FiGrid } from 'react-icons/fi';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  
  @media (max-width: 768px) {
    height: 100vh;
    height: 100dvh;
    /* 修复iPhone XR的安全区域 */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

const PlayerHeader = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1001;
  
  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
  }
`;

const CloseButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
`;

const VideoContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #111;
  width: 100%;
  height: 100%;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain; /* 改为contain避免裁剪 */
  
  @media (max-width: 768px) {
    object-fit: contain; /* iPhone XR使用contain而不是cover */
    /* 添加iOS特定样式 */
    -webkit-playsinline: true;
    -webkit-appearance: none;
  }
  
  &::-webkit-media-controls {
    display: none !important;
  }
  
  &::-webkit-media-controls-panel {
    display: none !important;
  }
  
  /* 隐藏所有原生控件 */
  &::-webkit-media-controls-play-button,
  &::-webkit-media-controls-start-playback-button {
    display: none !important;
  }
`;

const VideoPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const PlayButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 30px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
`;

const PlayerControls = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 600px;
  
  @media (max-width: 768px) {
    bottom: calc(20px + env(safe-area-inset-bottom)); /* 考虑安全区域 */
    width: 90%;
    max-width: none;
  }
`;

const Subtitle = styled.div`
  color: white;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 15px;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 500;
  min-width: 40px;
  
  @media (max-width: 768px) {
    font-size: 12px;
    min-width: 35px;
  }
`;

// 在styled-components部分更新ProgressBar样式
const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  transition: height 0.2s ease;
  
  /* 增大触摸区域 */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    bottom: -10px;
    cursor: pointer;
  }
  
  /* 悬停和拖拽时增加高度 */
  &:hover,
  &.dragging {
    height: 6px;
  }
  
  @media (max-width: 768px) {
    height: 6px;
    
    &::before {
      top: -15px;
      bottom: -15px;
    }
    
    &:hover,
    &.dragging {
      height: 8px;
    }
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #ff4757;
  border-radius: 2px;
  width: ${props => props.$progress || 0}%;
  transition: ${props => props.$isDragging ? 'none' : 'width 0.1s ease'};
  position: relative;
  
  /* 拖拽手柄 */
  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: #ff4757;
    border-radius: 50%;
    opacity: ${props => props.$isDragging || props.$isHovering ? 1 : 0};
    transition: opacity 0.2s ease;
    cursor: pointer;
    
    @media (max-width: 768px) {
      width: 16px;
      height: 16px;
      right: -8px;
    }
  }
`;

// 添加时间预览组件
const TimePreview = styled.div`
  position: absolute;
  bottom: 30px;
  left: ${props => props.$position}%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 1002;
`;

// 侧边控制按钮组件
const SideControls = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 30px;
  z-index: 1001;
  
  @media (max-width: 768px) {
    right: 10px;
    gap: 20px;
  }
`;

const SideButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

// 在Player组件中添加新的状态和处理函数
const Player = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const { 
    currentDrama, 
    currentEpisode, 
    isVip, 
    loadDramaDetail, 
    loadEpisode, 
    updateProgress, 
    toggleLike 
  } = useApp();
  
  // 基础状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1234);
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [videoError, setVideoError] = useState(null);
  
  // 添加缺失的拖拽相关状态
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [previewPosition, setPreviewPosition] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  // 添加缺失的ref
  const progressBarRef = useRef(null);
  
  const episodeNumber = parseInt(searchParams.get('episode')) || 1;

  // 检测设备类型
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 控制栏自动隐藏（移动端）
  useEffect(() => {
    if (!isMobile) return;
    
    let hideTimer;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 5000);
    };
    
    resetTimer();
    
    return () => clearTimeout(hideTimer);
  }, [isPlaying, isMobile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadDramaDetail(id);
        await loadEpisode(id, episodeNumber);
      } catch (error) {
        setVideoError(error.message || '加载剧集信息失败，请稍后重试');
      }
    };
    fetchData();
  }, [id, episodeNumber]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentEpisode) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration;
      if (total && !isNaN(total)) {
        setCurrentTime(current);
        setProgress((current / total) * 100);
        
        if (Math.floor(current) % 10 === 0) {
          updateProgress(id, episodeNumber, (current / total) * 100);
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setVideoError(null); // 清除错误状态
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    // 添加错误处理
    const handleError = (e) => {
      console.error('Video error:', e);
      setVideoError('视频加载失败，请检查网络连接或稍后重试');
      setIsPlaying(false);
    };
    
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [currentEpisode, id, episodeNumber, isMobile, isPlaying]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        // 添加更好的错误处理
        video.play().catch(error => {
          console.error('播放失败:', error);
          setVideoError('播放失败，请检查视频文件是否存在');
        });
      }
    }
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    navigate(-1);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toggleLike(id, episodeNumber);
  };

  const handleEpisodes = () => {
    navigate(`/episodes/${id}`);
  };

  // 优化的进度条处理函数
  const handleProgressClick = (e) => {
    const video = videoRef.current;
    if (video && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      video.currentTime = newTime;
    }
  };

  const handleVideoTouch = (e) => {
    e.preventDefault();
    if (isMobile) {
      setShowControls(true);
      if (e.detail === 2) {
        const video = videoRef.current;
        if (video && video.requestFullscreen) {
          video.requestFullscreen().catch(() => {});
        }
      }
      setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 5000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentEpisode) {
    return (
      <PlayerContainer>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
          <div>Loading...</div>
        </div>
      </PlayerContainer>
    );
  }

  const needsVip = currentEpisode.requiresVip && !isVip;
  
  if (needsVip) {
    navigate('/subscription');
    return null;
  }

  return (
    <PlayerContainer>
      {(!isMobile || showControls) && (
        <PlayerHeader>
          <CloseButton onClick={handleClose}>
            <FiX />
          </CloseButton>
        </PlayerHeader>
      )}

      <VideoContainer>
        <VideoElement 
          ref={videoRef}
          src={currentEpisode.videoUrl}
          controls={false}
          playsInline={true}
          webkitPlaysinline="true"
          preload="metadata"
          onClick={isMobile ? handleVideoTouch : handlePlayPause}
          onTouchStart={handleVideoTouch}
          webkit-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          style={{
            WebkitTapHighlightColor: 'transparent'
          }}
        />
        
        {videoError && (
          <VideoPlaceholder>
            <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
              <div style={{ marginBottom: '10px' }}>⚠️</div>
              <div>{videoError}</div>
              <button 
                onClick={() => {
                  setVideoError(null);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: '#ff4757',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                重试
              </button>
            </div>
          </VideoPlaceholder>
        )}
        
        {!isPlaying && !videoError && (
          <VideoPlaceholder>
            <PlayButton onClick={handlePlayPause}>
              <FaPlay />
            </PlayButton>
          </VideoPlaceholder>
        )}
        
        {(!isMobile || showControls) && (
          <PlayerControls>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Subtitle>{currentDrama?.title} - Episode {episodeNumber}</Subtitle>
            </div>
            
            <ProgressContainer>
              <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
              <ProgressBar 
                ref={progressBarRef}
                onClick={handleProgressClick}
              >
                <ProgressFill $progress={progress} />
              </ProgressBar>
              <TimeDisplay>{formatTime(duration)}</TimeDisplay>
            </ProgressContainer>
          </PlayerControls>
        )}
      </VideoContainer>

      {(!isMobile || showControls) && (
        <SideControls>
          <SideButton onClick={handleLike}>
            <FiHeart style={{ color: isLiked ? '#ff4757' : 'white' }} />
          </SideButton>
          <SideButton onClick={handleEpisodes}>
            <FiGrid />
          </SideButton>
        </SideControls>
      )}
    </PlayerContainer>
  );
};

export default Player;