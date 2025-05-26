import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

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
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    const updateFormattedTime = () => {
      if (timeRemaining === null) return;
      const remaining = Math.max(0, timeRemaining - (Date.now() - lastUpdateRef.current));
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setFormattedTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    };

    lastUpdateRef.current = Date.now();
    updateFormattedTime();
    const interval = setInterval(updateFormattedTime, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

  if (!isExpiring) return null;

  // Notification content
  const notification = (
    <div
      className="fixed bottom-5 right-5 max-w-sm w-full bg-white text-gray-800 rounded-lg shadow-xl ring-1 ring-gray-200 p-5 flex flex-col gap-4 transition transform duration-300 hover:scale-105 font-oswald"
      style={{ zIndex: 9999 }} // Ensure it's above everything
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M19 11c0 3.866-3.134 7-7 7S5 14.866 5 11 8.134 4 12 4s7 3.134 7 7z"
          />
        </svg>
        <h3 className="text-lg font-semibold">Session en cours d'expiration</h3>
      </div>
      <p className="text-sm">
        Votre session expirera dans <span className="font-bold">{formattedTime}</span>. Voulez-vous prolonger maintenant ?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
        >
          Déconnexion
        </button>
        <button
          onClick={onExtend}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Prolonger
        </button>
      </div>
    </div>
  );

  // Use portal to render at the end of <body>
  return createPortal(notification, document.body);
};

export default SessionNotification;
