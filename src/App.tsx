import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import CarRequestPage from './templates/CarRequestLayout';
import LoginPage from './pages/LoginPage';
import CarTrackingLayout from './templates/CarTrackingLayout';
import Loading from './components/atoms/Loading';
import ProfileUserPage from './pages/ProfileUserPage';
import DashboardLayout from './templates/DashboardLayout';
import SessionNotification from './components/organisms/SessionNotification/SessionNotification';
import useSession from './hooks/sessions/useSession';

import { getToken } from './services/authService';
import useWebSocketAgents from './hooks/useWebSocketAgents';

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

  // Fixed: Destructure the hook return value
  const { addEventListener } = useWebSocketAgents({
    onForceDisconnect: () => {

      logout(); // Ensure the session is cleared
    }
  });

  // Set up agent-specific event listeners
  useEffect(() => {
    if (!user) return;

    const cleanupFunctions: (() => void)[] = [];

    // Listen for agent-related events
    cleanupFunctions.push(
      addEventListener('agentStatusUpdate', (data) => {
      
      })
    );

    cleanupFunctions.push(
      addEventListener('newAgentAssignment', (data) => {
      })
    );

    cleanupFunctions.push(
      addEventListener('agentNotification', (data) => {
      })
    );

    // Cleanup all listeners when component unmounts or user changes
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [addEventListener, user]);

  const token = getToken();
  const isLoggedIn = Boolean(user) && Boolean(token);

  // Guard: If user and token are out of sync, render nothing (prevents flicker/white screen)
  if ((user && !token) || (!user && token)) {
    return <Loading />;
  }

  return (
    <>
      {isLoggedIn && (
        <SessionNotification
          isExpiring={sessionExpiring}
          timeRemaining={timeRemaining}
          onExtend={extendSession}
          onLogout={logout}
        />
      )}
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <ProfileUserPage /> : <Navigate to="/login" />} />
        <Route path="/car-request" element={isLoggedIn ? <CarRequestPage /> : <Navigate to="/login" />} />
        <Route path="/carTracking" element={isLoggedIn ? <CarTrackingLayout /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
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
  if (isMobile) return <div>Mobile Version Coming Soon</div>;

  return (
    <Router>
      <AppContent user={user} />
    </Router>
  );
};

export default App;