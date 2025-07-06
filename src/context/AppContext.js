import React, { createContext, useContext, useReducer, useEffect } from 'react';
import environment from '../config/environment';

const AppContext = createContext();

const initialState = {
  user: null,
  dramas: [],
  currentDrama: null,
  currentEpisode: null,
  watchProgress: {},
  isVip: false,
  loading: false,
  error: null
};

// 从本地JSON文件加载数据
const loadDramasFromFile = async () => {
  try {
    const response = await fetch('/data/dramas.json');
    const data = await response.json();
    return data.dramas;
  } catch (error) {
    console.error('Failed to load dramas:', error);
    // 如果加载失败，返回默认数据
    return [
      {
        id: 1,
        title: "Revenge of a Mafia Heiress",
        description: "A romantic story about revenge",
        coverUrl: "/media/covers/drama-1.jpg",
        thumbnailUrl: "/media/thumbnails/drama-1-thumb.jpg",
        category: "trending",
        isHot: true,
        isExclusive: true,
        totalEpisodes: 60,
        freeEpisodes: 3
      },
      {
        id: 2,
        title: "Take My Breath",
        description: "Romantic love story",
        coverUrl: "/media/covers/drama-2.jpg",
        thumbnailUrl: "/media/thumbnails/drama-2-thumb.jpg",
        category: "trending",
        isHot: true,
        isExclusive: true,
        totalEpisodes: 45,
        freeEpisodes: 3
      },
      {
        id: 3,
        title: "Young Elite",
        description: "Youth campus drama",
        coverUrl: "/media/covers/drama-3.jpg",
        thumbnailUrl: "/media/thumbnails/drama-3-thumb.jpg",
        category: "recommended",
        isRecommended: true,
        isExclusive: true,
        totalEpisodes: 30,
        freeEpisodes: 3
      }
    ];
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_DRAMAS':
      return { ...state, dramas: action.payload, loading: false };
    case 'SET_CURRENT_DRAMA':
      return { ...state, currentDrama: action.payload };
    case 'SET_CURRENT_EPISODE':
      return { ...state, currentEpisode: action.payload };
    case 'SET_WATCH_PROGRESS':
      return { ...state, watchProgress: action.payload };
    case 'UPDATE_EPISODE_PROGRESS':
      return {
        ...state,
        watchProgress: {
          ...state.watchProgress,
          [`${action.payload.dramaId}-${action.payload.episodeNumber}`]: action.payload.progress
        }
      };
    case 'SET_VIP_STATUS':
      return { ...state, isVip: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 初始化应用数据
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // 从本地文件加载数据
      const dramas = await loadDramasFromFile();
      
      setTimeout(() => {
        dispatch({ type: 'SET_DRAMAS', payload: dramas });
        dispatch({ type: 'SET_WATCH_PROGRESS', payload: {} });
        dispatch({ type: 'SET_VIP_STATUS', payload: false });
      }, 1000);
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadDramaDetail = async (dramaId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const drama = state.dramas.find(d => d.id === parseInt(dramaId));
      if (!drama) throw new Error('未找到该剧集');
      dispatch({ type: 'SET_CURRENT_DRAMA', payload: drama });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadEpisode = async (dramaId, episodeNumber) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const drama = state.dramas.find(d => d.id === parseInt(dramaId));
      let episode;
      if (drama && drama.episodes) {
        episode = drama.episodes.find(ep => ep.episodeNumber === episodeNumber);
        if (episode && episode.videoUrl) {
          episode = {
            ...episode,
            videoUrl: episode.videoUrl.startsWith('http') 
              ? episode.videoUrl 
              : `${environment.videoBaseUrl}${episode.videoUrl}`
          };
        }
      }
      if (!episode) {
        // 如果没有找到具体的剧集数据，创建默认数据
        episode = {
          id: `${dramaId}-${episodeNumber}`,
          episodeNumber,
          title: `Episode ${episodeNumber}`,
          duration: 126,
          videoUrl: drama 
            ? `${environment.videoBaseUrl}/media/videos/drama-${dramaId}/episode-${episodeNumber}.mp4` 
            : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          thumbnailUrl: drama ? drama.thumbnailUrl : "/images/episode-thumb.jpg",
          subtitle: "No, I can't do this.",
          requiresVip: episodeNumber > 3,
          likeCount: 7800,
          isLiked: false
        };
      }
      dispatch({ type: 'SET_CURRENT_EPISODE', payload: episode });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateProgress = async (dramaId, episodeNumber, progress) => {
    try {
      dispatch({ 
        type: 'UPDATE_EPISODE_PROGRESS', 
        payload: { dramaId, episodeNumber, progress } 
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const toggleLike = async (dramaId, episodeNumber) => {
    try {
      if (state.currentEpisode) {
        dispatch({ 
          type: 'SET_CURRENT_EPISODE', 
          payload: { 
            ...state.currentEpisode, 
            isLiked: !state.currentEpisode.isLiked,
            likeCount: state.currentEpisode.isLiked ? 
              state.currentEpisode.likeCount - 1 : 
              state.currentEpisode.likeCount + 1
          } 
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const value = {
    ...state,
    loadDramaDetail,
    loadEpisode,
    updateProgress,
    toggleLike,
    refreshData: initializeApp
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};