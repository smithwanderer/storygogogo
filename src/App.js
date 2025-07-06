import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home/Home';
import Player from './pages/Player/Player';
import Episodes from './pages/Episodes/Episodes';
import Subscription from './pages/Subscription/Subscription';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContainer>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/player/:id" element={<Player />} />
              <Route path="/episodes/:id" element={<Episodes />} />
              <Route path="/subscription" element={<Subscription />} />
            </Routes>
          </Router>
        </AppContainer>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
