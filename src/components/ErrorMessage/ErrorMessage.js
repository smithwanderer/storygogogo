import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h2`
  color: #ff4757;
  font-size: 20px;
  margin-bottom: 12px;
`;

const ErrorText = styled.p`
  color: #ccc;
  font-size: 16px;
  margin-bottom: 24px;
  max-width: 400px;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #5856eb;
  }
`;

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>Loading Failed</ErrorTitle>
      <ErrorText>{message || 'Unable to load content. Please check your network connection and try again.'}</ErrorText>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          Retry
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage;