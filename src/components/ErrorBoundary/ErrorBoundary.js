import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding: 20px;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #ff4757;
  font-size: 24px;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  color: #ccc;
  font-size: 16px;
  margin-bottom: 24px;
  max-width: 600px;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #5856eb;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>出现了一些问题</ErrorTitle>
          <ErrorMessage>
            应用遇到了意外错误。请尝试刷新页面，如果问题持续存在，请联系技术支持。
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            重新加载
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;