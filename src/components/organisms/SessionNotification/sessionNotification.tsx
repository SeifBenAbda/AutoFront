import React, { useEffect, useState } from 'react';

interface SessionNotificationProps {
  isExpiring: boolean;
  timeRemaining: number | null; 
  onExtend: () => void;
  onLogout: () => void;
}

const SessionNotification: React.FC<SessionNotificationProps> = ({
  isExpiring,
  timeRemaining,
  onExtend,
  onLogout,
}) => {
  const [formattedTime, setFormattedTime] = useState<string>('');
  
  // Update the formatted time every second for a smooth countdown
  useEffect(() => {
    const updateFormattedTime = () => {
      if (timeRemaining === null) return;
      
      const remaining = Math.max(0, timeRemaining - (Date.now() - lastUpdate));
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setFormattedTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    };
    
    // Keep track of when we last received a timeRemaining update
    const lastUpdate = Date.now();
    
    // Update immediately
    updateFormattedTime();
    
    // Then update every second
    const interval = setInterval(updateFormattedTime, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining]);

  if (!isExpiring) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        padding: '20px',
        borderRadius: '4px',
        zIndex: 1000,
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold' }}>
        Session Expiring
      </h3>
      <p style={{ margin: '0 0 10px', fontSize: '14px' }}>
        Your session will expire in <span style={{ fontWeight: 'bold' }}>{formattedTime}</span>. 
        Would you like to extend your session?
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            border: 'none',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
        <button
          onClick={onExtend}
          style={{
            padding: '8px 16px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Extend Session
        </button>
      </div>
    </div>
  );
};

export default SessionNotification;