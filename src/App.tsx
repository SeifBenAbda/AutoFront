import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import DashboardLayout from './templates/DashboardLayout';
import CarRequestPage from './pages/CarRequestPage';
import ItemChangePage from './pages/ItemChangePage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  const { user, checkAuth } = useAuth(); // Use the hook to get user data and determine login state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth(); // Check authentication state
      setLoading(false); // Set loading to false once authentication is checked
    };

    initializeAuth();
  }, [checkAuth]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while authentication is being checked
  }

  const isLoggedIn = Boolean(user); // Check if the user is logged in based on the hook

  return (
   
    <Router>
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
          path="/item-change"
          element={isLoggedIn ? <ItemChangePage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
