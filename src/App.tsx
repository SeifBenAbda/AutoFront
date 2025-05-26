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
import SessionNotification from './components/organisms/SessionNotification/SessionNotification';
import useSession from './hooks/sessions/useSession';
import { getToken } from './services/authService';


const AppContent: React.FC<{ user: any }> = ({ user }) => {
  const {
    sessionExpiring,
    timeRemaining,
    extendSession,
    logout
  } = useSession({
    warningTime: 60000,
    autoRefresh: false,
    enabled: true,
  });

  const token = getToken();
  const isLoggedIn = Boolean(user) && Boolean(token);

  // Guard: If user and token are out of sync, render nothing (prevents flicker/white screen)
  if ((user && !token) || (!user && token)) {
    return <LoginPage />;
  }

  return (
    <>
      {isLoggedIn && (
        <SessionNotification
          isExpiring={sessionExpiring}
          timeRemaining={timeRemaining ?? 0}
          onExtend={extendSession}
          onLogout={logout}
        />
      )}
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
        <Route path="/dashboard" element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />} />
        <Route path="/car-request" element={isLoggedIn ? <CarRequestPage /> : <Navigate to="/login" />} />
        <Route path="/carTracking" element={isLoggedIn ? <CarTrackingLayout /> : <Navigate to="/login" />} />
        <Route path="/itemTracking" element={isLoggedIn ? <ItemChangeTrackingPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <ProfileUserPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
};


const App: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

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

  if (loading) return <Loading />;
  if (isMobile) return <div style={{ textAlign: 'center', marginTop: '50%' }}>Mobile Version Coming Soon</div>;

  return (
    <Router>
      <AppContent user={user} />
    </Router>
  );
};

export default App;
