// Fixed App.tsx component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
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
import { getDatabaseName, state } from './utils/shared_functions';

const AppContent: React.FC<{ user: any }> = ({ user }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const token = getToken();
  const isLoggedIn = Boolean(user) && Boolean(token);

  const {
    sessionExpiring,
    timeRemaining,
    extendSession,
    logout
  } = useSession({
    warningTime: 60000,
    autoRefresh: false,
    enabled: isLoggedIn && !isLoginPage,
  });

  // Fixed: Only initialize WebSocket when user is logged in and stable
  const { addEventListener } = useWebSocketAgents({
    onForceDisconnect: () => {
      logout();
    },
    // Only connect when user is actually logged in
    connectOnMount: isLoggedIn && !isLoginPage
  });

  // Fixed: Stable event listeners with proper cleanup
  useEffect(() => {
    // Don't set up listeners if user is not logged in
    if (!isLoggedIn || isLoginPage) return;

    const cleanupFunctions: (() => void)[] = [];

    // Add a small delay to ensure socket is ready
    const timeoutId = setTimeout(() => {
      // Listen for agent-related events with proper cleanup
      cleanupFunctions.push(
        addEventListener('agentStatusUpdate', (data) => {
          //console.log('Agent status update:', data);
          // Handle agent status update
        })
      );

      cleanupFunctions.push(
        addEventListener('newAgentAssignment', (data) => {
          //console.log('New agent assignment:', data);
          // Handle new agent assignment
        })
      );

      cleanupFunctions.push(
        addEventListener('agentNotification', (data) => {
          //console.log('Agent notification:', data);
          // Handle agent notification
        })
      );
    }, 100); // Small delay to ensure socket is established

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      cleanupFunctions.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          //console.warn('Error during cleanup:', error);
        }
      });
    };
  }, [addEventListener, isLoggedIn, isLoginPage]); // Removed 'user' dependency to prevent re-runs

  // Guard: If user and token are out of sync, render nothing (prevents flicker/white screen)
  if ((user && !token) || (!user && token)) {
    return <LoginPage />;
  }

  return (
    <>
      {isLoggedIn && !isLoginPage && (
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

    state.databaseName = getDatabaseName();
    initializeAuth();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array - only run once

  if (loading) return <Loading />;
  if (isMobile) return <div>Mobile Version Coming Soon</div>;

  return (
    <Router>
      <AppContent user={user} />
    </Router>
  );
};

export default App;