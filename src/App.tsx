import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';


import CarRequestPage from './templates/CarRequestLayout';
import LoginPage from './pages/LoginPage';
import ItemChangeTrackingPage from './pages/ItemChangeTrackingPage';
import CarTrackingLayout from './templates/CarTrackingLayout';
import Loading from './components/atoms/Loading';
import ProfileUserPage from './pages/ProfileUserPage';
import DashboardLayout from './templates/DashboardLayout';
import useSession from './hooks/sessions/useSession';
import SessionNotification from './components/organisms/SessionNotification/sessionNotification';

const AppContent: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  
  // Initialize session management with 1 minute warning before expiry
  const { sessionExpiring, timeRemaining, extendSession, logout } = useSession({
    warningTime: 60000, // 1 minute
    autoRefresh: false  // Don't auto refresh, let the user decide
  });

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setLoading(false);
    };

    initializeAuth();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (isMobile) {
    return <div style={{ textAlign: 'center', marginTop: '50%' }}>Mobile Version Coming Soon</div>;
  }

  const isLoggedIn = Boolean(user);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />}
        />
        <Route
          path="/car-request"
          element={isLoggedIn ? <CarRequestPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/carTracking"
          element={isLoggedIn ? <CarTrackingLayout /> : <Navigate to="/login" />}
        />
        <Route
          path="/itemTracking"
          element={isLoggedIn ? <ItemChangeTrackingPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <ProfileUserPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/car-request" : "/login"} />} />
      </Routes>

      {/* Session notification will only show when session is expiring */}
      {isLoggedIn && (
        <SessionNotification
          isExpiring={sessionExpiring}
          timeRemaining={timeRemaining}
          onExtend={extendSession}
          onLogout={logout}
        />
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;