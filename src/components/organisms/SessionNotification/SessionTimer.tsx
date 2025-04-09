import { getExpiresAt } from '../../../services/authService';
import React, { useEffect, useState } from 'react';


interface SessionTimerProps {
  onSessionExpiring?: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ onSessionExpiring }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isExpiring, setIsExpiring] = useState(false);
  
  useEffect(() => {
    const updateTimeRemaining = () => {
      const expiresAt = getExpiresAt();
      
      if (!expiresAt) {
        setTimeRemaining('--:--');
        return;
      }
      
      const remaining = expiresAt - Date.now();
      
      if (remaining <= 0) {
        setTimeRemaining('00:00');
        return;
      }
      
      // Check if session is about to expire (less than 1 minute)
      if (remaining <= 60000 && !isExpiring) {
        setIsExpiring(true);
        if (onSessionExpiring) {
          onSessionExpiring();
        }
      }
      
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      
      setTimeRemaining(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    };
    
    // Update immediately
    updateTimeRemaining();
    
    // Update every second
    const interval = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [isExpiring, onSessionExpiring]);
  
  return (
    <div className="session-timer">
      <span 
        style={{ 
          fontSize: '14px',
          color: isExpiring ? '#dc2626' : '#6b7280',
          fontWeight: isExpiring ? 'bold' : 'normal'
        }}
      >
        Session: {timeRemaining}
      </span>
    </div>
  );
};

export default SessionTimer;