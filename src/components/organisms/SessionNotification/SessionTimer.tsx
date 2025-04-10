import { getExpiresAt } from '../../../services/authService';
import React, { useEffect, useRef, useState } from 'react';

interface SessionTimerProps {
  onSessionExpiring?: () => void;
  onExtended?: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ onSessionExpiring, onExtended }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('--:--');
  const [isExpiring, setIsExpiring] = useState(false);
  const lastExpiresAtRef = useRef<number | null>(null); // ✅ ref instead of state

  useEffect(() => {
    const updateTimeRemaining = () => {
      const expiresAt = getExpiresAt();

      if (!expiresAt) {
        setTimeRemaining('--:--');
        return;
      }

      // Session was extended
      if (lastExpiresAtRef.current && expiresAt > lastExpiresAtRef.current) {
        setIsExpiring(false);
        if (onExtended) onExtended();
      }

      lastExpiresAtRef.current = expiresAt;

      const remaining = expiresAt - Date.now();

      if (remaining <= 0) {
        setTimeRemaining('00:00');
        return;
      }

      if (remaining <= 60000 && !isExpiring) {
        setIsExpiring(true);
        if (onSessionExpiring) onSessionExpiring();
      } else if (remaining > 60000 && isExpiring) {
        setIsExpiring(false);
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      setTimeRemaining(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    };

    updateTimeRemaining(); // immediate
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [isExpiring, onSessionExpiring, onExtended]);

  return (
    <div className="session-timer">
      <span
        className={`text-sm ${
          isExpiring ? 'text-red-600 font-bold' : 'text-gray-500 font-normal'
        }`}
      >
        Session: {timeRemaining}
      </span>
    </div>
  );
};

export default SessionTimer;
