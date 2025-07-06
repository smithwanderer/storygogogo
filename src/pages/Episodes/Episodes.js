import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FiX, FiLock } from 'react-icons/fi';

const EpisodesContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const EpisodesModal = styled.div`
  background: rgba(30, 30, 30, 0.95);
  border-radius: 16px;
  padding: 20px;
  max-width: 600px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  
  @media (max-width: 768px) {
    width: 98%;
    max-height: 90vh;
    padding: 15px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    padding: 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const EpisodeRange = styled.div`
  color: #6366f1;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const EpisodesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  
  @media (max-width: 360px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
`;

const EpisodeButton = styled.button`
  background: ${props => {
    if (props.$isLocked) return 'rgba(255, 255, 255, 0.1)';
    if (props.$isCurrent) return '#6366f1';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  border: ${props => props.$isCurrent ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.3)'};
  color: ${props => props.$isLocked ? '#888' : '#fff'};
  padding: 15px;
  border-radius: 8px;
  cursor: ${props => props.$isLocked ? 'not-allowed' : 'pointer'};
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  min-height: 50px;
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 14px;
    min-height: 45px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 13px;
    min-height: 40px;
    gap: 4px;
  }
  
  @media (max-width: 360px) {
    padding: 8px;
    font-size: 12px;
    min-height: 35px;
  }
  
  &:hover {
    ${props => !props.$isLocked && `
      background: rgba(99, 102, 241, 0.3);
      transform: scale(1.05);
    `}
  }
  
  @media (max-width: 480px) {
    &:hover {
      transform: none;
    }
  }
`;

const LockIcon = styled(FiLock)`
  font-size: 14px;
`;

const Episodes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentEpisode, setCurrentEpisode] = useState(1);
  
  // 模拟数据：前3集免费，其余需要VIP
  const totalEpisodes = 60;
  const freeEpisodes = 3;

  const handleClose = () => {
    navigate(-1);
  };

  const handleEpisodeClick = (episodeNum) => {
    if (episodeNum <= freeEpisodes) {
      setCurrentEpisode(episodeNum);
      navigate(`/player/${id}?episode=${episodeNum}`);
    } else {
      navigate('/subscription');
    }
  };

  const renderEpisodes = () => {
    const episodes = [];
    for (let i = 1; i <= totalEpisodes; i++) {
      const isLocked = i > freeEpisodes;
      const isCurrent = i === currentEpisode;
      
      episodes.push(
        <EpisodeButton
          key={i}
          $isLocked={isLocked}
          $isCurrent={isCurrent}
          onClick={() => handleEpisodeClick(i)}
        >
          {isLocked && <LockIcon />}
          {i}
        </EpisodeButton>
      );
    }
    return episodes;
  };

  return (
    <EpisodesContainer>
      <EpisodesModal>
        <ModalHeader>
          <ModalTitle>Episodes</ModalTitle>
          <CloseButton onClick={handleClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        
        <EpisodeRange>1-60</EpisodeRange>
        
        <EpisodesGrid>
          {renderEpisodes()}
        </EpisodesGrid>
      </EpisodesModal>
    </EpisodesContainer>
  );
};

export default Episodes;