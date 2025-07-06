const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.dashdramas.com';
import AWSVideoService from './awsConfig';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // 添加认证token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 获取剧集列表
  async getDramas(category = 'all', page = 1, limit = 20) {
    return this.request(`/dramas?category=${category}&page=${page}&limit=${limit}`);
  }

  // 获取单个剧集详情
  async getDramaById(id) {
    return this.request(`/dramas/${id}`);
  }

  // 获取剧集的所有集数
  async getEpisodes(dramaId) {
    return this.request(`/dramas/${dramaId}/episodes`);
  }

  // 获取单集详情和播放链接（集成AWS）
  async getEpisodeDetail(dramaId, episodeNumber) {
    try {
      // 首先从后端API获取基本信息
      const episode = await this.request(`/dramas/${dramaId}/episodes/${episodeNumber}`);
      
      // 然后从AWS S3获取视频URL
      const videoUrl = await this.getVideoUrl(dramaId, episodeNumber, episode.requiresVip);
      const thumbnailUrl = AWSVideoService.getThumbnailUrl(dramaId, episodeNumber);
      
      return {
        ...episode,
        videoUrl,
        thumbnailUrl
      };
    } catch (error) {
      console.error('Error getting episode detail:', error);
      throw error;
    }
  }

  // 根据VIP状态获取视频URL
  async getVideoUrl(dramaId, episodeNumber, requiresVip = false) {
    const isVip = localStorage.getItem('isVip') === 'true';
    
    if (requiresVip && !isVip) {
      // 返回预览版本或跳转到订阅页面
      return AWSVideoService.getVideoUrl(dramaId, episodeNumber, 'preview');
    }
    
    // 对于VIP内容，使用预签名URL确保安全
    if (requiresVip) {
      return await AWSVideoService.getSignedVideoUrl(dramaId, episodeNumber);
    }
    
    // 免费内容直接返回公开URL
    return AWSVideoService.getVideoUrl(dramaId, episodeNumber);
  }

  // 检查视频可用性
  async checkVideoAvailability(dramaId, episodeNumber) {
    return await AWSVideoService.checkVideoExists(dramaId, episodeNumber);
  }
}

export default new ApiService();