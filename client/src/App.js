import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Navbar from './components/Navbar';
import styled from 'styled-components';

// register 
import RegisterPage from './RegisterPage';
import CatListPage from './CatListPage';
import AddCatPage from './AddCatPage';
import CatDetailsPage from './CatDetailsPage';
import AddRecordForCatPage from './AddRecordForCatPage';
import EditRecordPage from './EditRecordPage';
import EditCatPage from './EditCatPage';
import ProtectedRoute from './protectedroute';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <AppContainer>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <MainContent>
          <Routes>
            <Route path="/login" element={
              isLoggedIn ? <Navigate to="/cats" /> : <LoginPage onLogin={handleLogin} />
            } />
            <Route path="/cats" element={
              isLoggedIn ? <CatListPage /> : <Navigate to="/login" />
            } />
            <Route path="/" element={
              isLoggedIn ? <Navigate to="/cats" /> : <Navigate to="/login" />
            } />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/add-cat' element={
              <ProtectedRoute>
                <AddCatPage />
              </ProtectedRoute>
            } />
            <Route path='/cats/:id' element={
              <ProtectedRoute>
                <CatDetailsPage />
              </ProtectedRoute>
            } />
            <Route path='/cats/:id/add-record' element={
              <ProtectedRoute>
                <AddRecordForCatPage />
              </ProtectedRoute>
            } />
            <Route path='/records/:recordId/edit' element={
              <ProtectedRoute>
                <EditRecordPage />
              </ProtectedRoute>
            } />
            <Route path='/cats/:id/edit' element={
              <ProtectedRoute>
                <EditCatPage />
              </ProtectedRoute>
            } />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
