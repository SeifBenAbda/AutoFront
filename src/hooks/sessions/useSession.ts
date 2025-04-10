import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getExpiresAt, refreshToken, removeToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

interface UseSessionOptions {
  warningTime?: number;
  autoRefresh?: boolean;
  enabled?: boolean;
}

const useSession = (options: UseSessionOptions = {}) => {
    const {
      warningTime = 60000,
      autoRefresh = false,
      enabled = true
    } = options;
  
    const [sessionExpiring, setSessionExpiring] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isTabActive, setIsTabActive] = useState(true);
    const [hasExtended, setHasExtended] = useState(false);
  
    const lastActivityRef = useRef(Date.now()); // ✅ useRef instead of useState
  
    const navigate = useNavigate();
  
    // ✅ Passive activity tracking WITHOUT causing re-renders
    useEffect(() => {
      const updateActivity = () => {
        lastActivityRef.current = Date.now();
      };
  
      window.addEventListener('mousemove', updateActivity);
      window.addEventListener('keydown', updateActivity);
  
      return () => {
        window.removeEventListener('mousemove', updateActivity);
        window.removeEventListener('keydown', updateActivity);
      };
    }, []);
  
    useEffect(() => {
      const handleVisibilityChange = () => {
        setIsTabActive(!document.hidden);
      };
  
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);
  
    const calculateTimeRemaining = useCallback(() => {
      if (!enabled) return null;
  
      let expiresAt = getExpiresAt();
  
      if (!expiresAt) {
        const token = getToken();
        if (token) {
          try {
            const decoded = jwtDecode<{ exp: number }>(token);
            expiresAt = decoded.exp * 1000;
          } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
          }
        } else return null;
      }
  
      const remaining = expiresAt - Date.now();
      return remaining > 0 ? remaining : 0;
    }, [enabled]);
  
    const checkSession = useCallback(() => {
      if (!enabled) return false;
      const remaining = calculateTimeRemaining();
      return remaining !== null && remaining <= warningTime * 2 && remaining > 0;
    }, [calculateTimeRemaining, enabled, warningTime]);
  
    const extendSession = useCallback(async () => {
      if (!enabled) return false;
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
    }, [enabled]);
  
    const logout = useCallback(() => {
      removeToken();
      setSessionExpiring(false);
      navigate('/login');
    }, [navigate]);
  
    useEffect(() => {
      if (!enabled) {
        setSessionExpiring(false);
        setTimeRemaining(null);
        return;
      }
  
      const checkSessionStatus = () => {
        const remaining = calculateTimeRemaining();
        setTimeRemaining(remaining);
  
        const now = Date.now();
        const isUserActive = now - lastActivityRef.current < 60000;
  
        if (remaining !== null) {
          if (remaining <= warningTime && remaining > 0) {
            setSessionExpiring(true);
  
            if (
              isTabActive &&
              isUserActive &&
              remaining <= 60000 &&
              !hasExtended
            ) {
              extendSession();
              setHasExtended(true);
            }
          } else if (remaining <= 0) {
            logout();
          } else if (autoRefresh && remaining <= warningTime * 2 && remaining > warningTime) {
            extendSession();
          } else {
            setSessionExpiring(false);
          }
  
          if (remaining > 60000 && hasExtended) {
            setHasExtended(false);
          }
        }
      };
  
      checkSessionStatus();
      const interval = setInterval(checkSessionStatus, 5000);
      return () => clearInterval(interval);
    }, [
      warningTime,
      autoRefresh,
      calculateTimeRemaining,
      extendSession,
      logout,
      enabled,
      isTabActive,
      hasExtended
    ]);
  
    return {
      sessionExpiring,
      timeRemaining,
      extendSession,
      logout,
      checkSession
    };
  };
  
  export default useSession;
