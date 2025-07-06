import AWS from 'aws-sdk';

// AWS配置
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});

const s3 = new AWS.S3();

class AWSVideoService {
  constructor() {
    this.bucketName = process.env.REACT_APP_S3_BUCKET_NAME;
    this.cloudFrontDomain = process.env.REACT_APP_CLOUDFRONT_DOMAIN;
  }

  // 生成视频URL
  getVideoUrl(dramaId, episodeNumber, quality = 'hd') {
    const key = `dramas/${dramaId}/episodes/ep_${episodeNumber}_${quality}.mp4`;
    
    if (this.cloudFrontDomain) {
      return `https://${this.cloudFrontDomain}/${key}`;
    }
    
    return `https://${this.bucketName}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`;
  }

  // 生成缩略图URL
  getThumbnailUrl(dramaId, episodeNumber) {
    const key = `dramas/${dramaId}/thumbnails/ep_${episodeNumber}.jpg`;
    
    if (this.cloudFrontDomain) {
      return `https://${this.cloudFrontDomain}/${key}`;
    }
    
    return `https://${this.bucketName}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`;
  }

  // 生成预签名URL（用于私有视频）
  async getSignedVideoUrl(dramaId, episodeNumber, expiresIn = 3600) {
    const key = `dramas/${dramaId}/episodes/ep_${episodeNumber}.mp4`;
    
    try {
      const signedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn
      });
      
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  // 检查视频是否存在
  async checkVideoExists(dramaId, episodeNumber) {
    const key = `dramas/${dramaId}/episodes/ep_${episodeNumber}.mp4`;
    
    try {
      await s3.headObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();
      
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  // 获取视频元数据
  async getVideoMetadata(dramaId, episodeNumber) {
    const key = `dramas/${dramaId}/episodes/ep_${episodeNumber}.mp4`;
    
    try {
      const metadata = await s3.headObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();
      
      return {
        size: metadata.ContentLength,
        lastModified: metadata.LastModified,
        contentType: metadata.ContentType,
        metadata: metadata.Metadata
      };
    } catch (error) {
      console.error('Error getting video metadata:', error);
      throw error;
    }
  }
}

export default new AWSVideoService();