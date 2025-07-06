import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import environment from '../../config/environment';

const SectionContainer = styled.div`
  margin-bottom: 40px;
`;

const ItemsGrid = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const ItemCard = styled.div`
  min-width: 200px;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ItemImage = styled.div`
  width: 200px;
  height: 280px;
  background-image: url(${props => {
    if (props.$coverUrl) {
      // 修复URL拼接逻辑
      const coverUrl = props.$coverUrl.startsWith('/') 
        ? props.$coverUrl.substring(1) 
        : props.$coverUrl;
      return `${environment.mediaBaseUrl}/${coverUrl}`;
    }
    return 'none';
  }});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  
  /* 当没有封面图片时显示标题 */
  ${props => props.$coverUrl && `
    & > span {
      display: none;
    }
  `}
`;

const ExclusiveTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #6366f1;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${props => props.progress}%;
  height: 4px;
  background: #6366f1;
  transition: width 0.3s ease;
  z-index: 1;
`;

const ItemTitle = styled.h3`
  color: #fff;
  font-size: 16px;
  margin: 12px 0 0 0;
  font-weight: 500;
`;

const ContentSection = ({ items, showProgress, watchProgress }) => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    navigate(`/player/${item.id}`);
  };

  const getProgress = (item) => {
    if (!showProgress || !watchProgress) return 0;
    const progressKey = Object.keys(watchProgress).find(key => 
      key.startsWith(`${item.id}-`)
    );
    return progressKey ? watchProgress[progressKey] : 0;
  };

  return (
    <SectionContainer>
      <ItemsGrid>
        {items.map((item) => {
          const progress = getProgress(item);
          return (
            <ItemCard key={item.id} onClick={() => handleItemClick(item)}>
              <ItemImage $coverUrl={item.coverUrl}>
                <span>{item.title}</span>
                {item.isExclusive && <ExclusiveTag>Exclusive</ExclusiveTag>}
                {showProgress && progress > 0 && (
                  <ProgressBar progress={progress} />
                )}
              </ItemImage>
              <ItemTitle>{item.title}</ItemTitle>
            </ItemCard>
          );
        })}
      </ItemsGrid>
    </SectionContainer>
  );
};

export default ContentSection;