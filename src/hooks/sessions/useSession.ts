import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getExpiresAt, refreshToken, removeToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

interface UseSessionOptions {
  warningTime?: number; // Time in ms before expiry to show warning
  autoRefresh?: boolean; // Whether to auto refresh the token
}

const useSession = (options: UseSessionOptions = {}) => {
  const { 
    warningTime = 60000, // Default warning 1 minute before expiry
    autoRefresh = false  // Default to not auto refresh
  } = options;
  
  const [sessionExpiring, setSessionExpiring] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const navigate = useNavigate();

  // Function to calculate time remaining
  const calculateTimeRemaining = useCallback(() => {
    // First try to get the expiration time from localStorage
    let expiresAt = getExpiresAt();
    
    // If not available, try to calculate from the token
    if (!expiresAt) {
      const token = getToken();
      if (token) {
        try {
          const decoded = jwtDecode<{ exp: number }>(token);
          expiresAt = decoded.exp * 1000; // Convert to milliseconds
        } catch (error) {
          console.error('Failed to decode token:', error);
          return null;
        }
      } else {
        return null;
      }
    }
    
    const remaining = expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  }, []);

  // Function to extend session
  const extendSession = useCallback(async () => {
    try {
      const result = await refreshToken();
      if (result) {
        setSessionExpiring(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }, []);

  // Function to logout
  const logout = useCallback(() => {
    removeToken();
    navigate('/login');
  }, [navigate]);

  // Update time remaining periodically
  useEffect(() => {
    const checkSession = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining !== null) {
        // If time remaining is less than warning time, show warning
        if (remaining <= warningTime && remaining > 0) {
          setSessionExpiring(true);
        } 
        // If session expired, logout
        else if (remaining <= 0) {
          logout();
        }
        // If auto refresh is enabled and time is running low, refresh
        else if (autoRefresh && remaining <= warningTime * 2 && remaining > warningTime) {
          extendSession();
        }
      }
    };

    // Check immediately on mount
    checkSession();
    
    // Check every 5 seconds
    const interval = setInterval(checkSession, 5000);
    
    return () => clearInterval(interval);
  }, [warningTime, autoRefresh, calculateTimeRemaining, extendSession, logout]);

  return {
    sessionExpiring,
    timeRemaining,
    extendSession,
    logout,
  };
};

export default useSession;