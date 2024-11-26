import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import CarRequestPage from './templates/CarRequestLayout';
import LoginPage from './pages/LoginPage';
import ItemChangeTrackingPage from './pages/ItemChangeTrackingPage';
import CarTrackingLayout from './templates/CarTrackingLayout';
import Loading from './components/atoms/Loading';
import ProfileUserPage from './pages/ProfileUserPage';


const App: React.FC = () => {
  const { user, checkAuth } = useAuth(); // Use the hook to get user data and determine login state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth(); // Check authentication state
      setLoading(false); // Set loading to false once authentication is checked
    };

    initializeAuth();
  }, []);

  if (loading) {
    return <Loading />
  }

  const isLoggedIn = Boolean(user); // Check if the user is logged in based on the hook
  {/**
      <Route
          path="/dashboard"
          element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />}
        />  
    */}
  return (

    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

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
    </Router>
  );
};

export default App;