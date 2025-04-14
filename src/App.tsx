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

  const isLoggedIn = Boolean(user);

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />} />
        <Route path="/car-request" element={isLoggedIn ? <CarRequestPage /> : <Navigate to="/login" />} />
        <Route path="/carTracking" element={isLoggedIn ? <CarTrackingLayout /> : <Navigate to="/login" />} />
        <Route path="/itemTracking" element={isLoggedIn ? <ItemChangeTrackingPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <ProfileUserPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/car-request" : "/login"} />} />
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
