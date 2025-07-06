import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header/Header';
import ContentSection from '../../components/ContentSection/ContentSection';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: #000;
`;

const ContentWrapper = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  margin: 30px 0 20px 0;
  font-weight: 600;
`;

const Home = () => {
  const { dramas, watchProgress, loading, error, refreshData } = useApp();

  useEffect(() => {
    if (dramas.length === 0 && !loading) {
      refreshData();
    }
  }, []);

  if (loading && dramas.length === 0) {
    return (
      <HomeContainer>
        <Header />
        <LoadingSpinner />
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <Header />
        <ErrorMessage message={error} onRetry={refreshData} />
      </HomeContainer>
    );
  }

  // 根据数据分类
  const continueWatching = dramas.filter(drama => {
    const progressKey = Object.keys(watchProgress).find(key => 
      key.startsWith(`${drama.id}-`)
    );
    return progressKey && watchProgress[progressKey] > 0 && watchProgress[progressKey] < 100;
  });

  const trending = dramas.filter(drama => drama.category === 'trending' || drama.isHot);
  const bestChoice = dramas.filter(drama => drama.category === 'recommended' || drama.isRecommended);

  return (
    <HomeContainer>
      <Header />
      <ContentWrapper>
        {continueWatching.length > 0 && (
          <>
            <SectionTitle>Continue Watching</SectionTitle>
            <ContentSection items={continueWatching} showProgress watchProgress={watchProgress} />
          </>
        )}
        
        {trending.length > 0 && (
          <>
            <SectionTitle>Trending 🔥</SectionTitle>
            <ContentSection items={trending} />
          </>
        )}
        
        {bestChoice.length > 0 && (
          <>
            <SectionTitle>Best Choice 👍</SectionTitle>
            <ContentSection items={bestChoice} />
          </>
        )}
        
        {dramas.length > 0 && (
          <>
            <SectionTitle>All Dramas</SectionTitle>
            <ContentSection items={dramas} />
          </>
        )}
      </ContentWrapper>
    </HomeContainer>
  );
};

export default Home;