import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getExpiresAt, refreshToken, removeToken, logoutUser } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../../context/userContext';

interface UseSessionOptions {
  warningTime?: number;
  autoRefresh?: boolean;
  enabled?: boolean;
  autoExtendOnActivity?: boolean; // New option
}

const useSession = (options: UseSessionOptions = {}, checkAuth?: () => Promise<void>) => {
    const {
      warningTime = 180000,
      autoRefresh = false,
      enabled = true,
      autoExtendOnActivity = true // Default to true
    } = options;
  
    const [sessionExpiring, setSessionExpiring] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isTabActive, setIsTabActive] = useState(true);
    const [hasExtended, setHasExtended] = useState(false);
    const {user} = useUser();
    const lastActivityRef = useRef(Date.now());
    const lastExtensionRef = useRef(0); // Track last extension time
    const isExtendingRef = useRef(false); // Prevent multiple simultaneous extensions
  
    const navigate = useNavigate();
  
    // Enhanced activity tracking with auto-extension logic
    useEffect(() => {
      const updateActivity = async () => {
        const now = Date.now();
        lastActivityRef.current = now;
        
        // Check if user was active in the last 3 minutes (180000ms)
        const wasRecentlyActive = now - lastActivityRef.current < 180000;
        
        // Auto-extend session if in warning zone and conditions are met
        if (
          autoExtendOnActivity &&
          sessionExpiring &&
          isTabActive &&
          !isExtendingRef.current &&
          wasRecentlyActive &&
          (now - lastExtensionRef.current) > 30000 // Prevent extending too frequently (30 sec cooldown)
        ) {
          const remaining = calculateTimeRemaining();
          
          // Only auto-extend if we're in warning zone but not critically low
          if (remaining && remaining <= warningTime && remaining > 30000) {
            console.log('Auto-extending session due to recent user activity (last 3 minutes)');
            isExtendingRef.current = true;
            
            try {
              const success = await extendSession();
              if (success) {
                lastExtensionRef.current = now;
                setHasExtended(true);
              }
            } catch (error) {
              console.error('Auto-extension failed:', error);
            } finally {
              isExtendingRef.current = false;
            }
          }
        }
      };
  
      // Throttle the activity handler to prevent excessive calls
      let timeoutId: NodeJS.Timeout;
      const throttledUpdateActivity = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateActivity, 1000); // Throttle to max once per second
      };
  
      // All activity events that should trigger auto-extension
      window.addEventListener('mousemove', throttledUpdateActivity, { passive: true });
      window.addEventListener('keydown', updateActivity, { passive: true });
      window.addEventListener('keyup', updateActivity, { passive: true });
      window.addEventListener('click', updateActivity, { passive: true });
      window.addEventListener('scroll', throttledUpdateActivity, { passive: true });
      window.addEventListener('wheel', throttledUpdateActivity, { passive: true });
      window.addEventListener('touchstart', updateActivity, { passive: true });
      window.addEventListener('touchmove', throttledUpdateActivity, { passive: true });
      window.addEventListener('focus', updateActivity, { passive: true });
  
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('mousemove', throttledUpdateActivity);
        window.removeEventListener('keydown', updateActivity);
        window.removeEventListener('keyup', updateActivity);
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('scroll', throttledUpdateActivity);
        window.removeEventListener('wheel', throttledUpdateActivity);
        window.removeEventListener('touchstart', updateActivity);
        window.removeEventListener('touchmove', throttledUpdateActivity);
        window.removeEventListener('focus', updateActivity);
      };
    }, [sessionExpiring, isTabActive, autoExtendOnActivity, warningTime]);
  
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
  
    const logout = useCallback(async () => {
      if(user){
        await logoutUser(user!.username).then(() => {
        removeToken();
        setSessionExpiring(false);
        if (checkAuth) checkAuth(); // Update user state in useAuth
     
        navigate('/login');
      });
      }else{
        removeToken();
        setSessionExpiring(false);
        if (checkAuth) checkAuth(); // Update user state in useAuth
        navigate('/login');
      }
    }, [navigate, checkAuth, user]);
  
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
        const isUserActive = now - lastActivityRef.current < 180000; // Changed to 3 minutes (180000ms)
  
        if (remaining === null) {
          // Token is missing or invalid, force logout
            logout();
          return;
        }
  
        if (remaining <= warningTime && remaining > 0) {
          setSessionExpiring(true);
  
          // Original auto-extension logic (fallback)
          if (
            isTabActive &&
            isUserActive &&
            remaining <= 60000 &&
            !hasExtended &&
            !isExtendingRef.current
          ) {
            extendSession().then((success) => {
              if (success) {
                setHasExtended(true);
                lastExtensionRef.current = now;
              }
            });
          }
        } else if (remaining <= 0) {
            logout();
        } else if (autoRefresh && remaining <= warningTime * 2 && remaining > warningTime) {
          extendSession();
        } else {
          setSessionExpiring(false);
        }
  
        // Reset hasExtended flag when session is no longer in warning zone
        if (remaining > warningTime && hasExtended) {
          setHasExtended(false);
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
  
    useEffect(() => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === 'token' && event.newValue === null) {
          // Token was removed in another tab
          setSessionExpiring(false);
         logout();
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }, [navigate]);
  
    return {
      sessionExpiring,
      timeRemaining,
      extendSession,
      logout,
      checkSession,
      isTabActive // Export tab active state for external use
    };
  };
  
  export default useSession;