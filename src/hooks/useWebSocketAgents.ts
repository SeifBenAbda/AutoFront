import { useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUser } from '../context/userContext';
import { removeToken } from '../services/authService';

const SOCKET_URL = import.meta.env.VITE_API_URL;

// Optimized socket manager that only connects when needed
class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private activeHooks = new Set<string>();
  private activeListeners = new Set<string>(); // Track actual listeners
  private currentUser: string | null = null;
  private isAuthenticating = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private lastActivity = 0;
  
  // Configuration
  private readonly IDLE_TIMEOUT = 30000; // 30 seconds of inactivity before disconnect
  private readonly RECONNECT_DELAY = 2000;

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  private constructor() {
    // Generate unique tab ID
    if (!window.name) {
      window.name = `tab_${Date.now()}_${Math.random()}`;
    }
  }

  private createSocket(): Socket {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000, // Increased timeout
      reconnection: true,
      reconnectionAttempts: 3, // Reduced attempts
      reconnectionDelay: this.RECONNECT_DELAY,
      forceNew: true,
      // Optimize polling interval
      upgrade: true,
      rememberUpgrade: true,
    });

    newSocket.on('connect', () => {
      this.updateActivity();
      
      // Re-authenticate if we have a current user
      if (this.currentUser && !this.isAuthenticating) {
        this.authenticate(this.currentUser);
      }
    });

    newSocket.on('disconnect', (reason) => {
      this.isAuthenticating = false;
      
      // Only auto-reconnect if we have active listeners and it's not a manual disconnect
      if (this.activeListeners.size > 0 && 
          (reason === 'io server disconnect' || reason === 'transport close' || reason === 'ping timeout')) {
        this.scheduleReconnect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔥 WebSocket connection error:', error);
      this.isAuthenticating = false;
      
      // Only reconnect if we have active listeners
      if (this.activeListeners.size > 0) {
        this.scheduleReconnect();
      }
    });

    newSocket.on('authenticate_response', (data) => {
      this.isAuthenticating = false;
      this.updateActivity();
    });

    // Force disconnect handler
    newSocket.on('forceDisconnect', (data: any) => {
      // Clear user data and token
      removeToken();
      this.currentUser = null;
      
      // Disconnect socket immediately
      this.disconnect();
      
      // Trigger logout in this tab
      window.dispatchEvent(new CustomEvent('forceLogout', { detail: data }));
    });

    // Track any incoming messages as activity
    newSocket.onAny(() => {
      this.updateActivity();
    });

    return newSocket;
  }

  private updateActivity() {
    this.lastActivity = Date.now();
    this.resetIdleTimer();
  }

  private resetIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    // Only set idle timer if we have a connection but no active listeners
    if (this.socket?.connected && this.activeListeners.size === 0) {
      this.idleTimer = setTimeout(() => {
        this.disconnect();
      }, this.IDLE_TIMEOUT);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectTimer = setTimeout(() => {
      if (this.activeListeners.size > 0 && (!this.socket || !this.socket.connected)) {
        this.socket = this.createSocket();
      }
    }, this.RECONNECT_DELAY);
  }

  private authenticate(username: string) {
    if (!this.socket || !this.socket.connected || this.isAuthenticating) {
      return;
    }

    this.isAuthenticating = true;
    this.socket.emit('authenticate', { username });
    // Reset flag after timeout
    setTimeout(() => {
      this.isAuthenticating = false;
    }, 5000);
  }

  // Only create socket when actually needed
  private ensureSocket(): Socket | null {
    if (!this.socket || this.socket.disconnected) {
      // Only create if we have active listeners or hooks
      if (this.activeListeners.size > 0 || this.activeHooks.size > 0) {
        this.socket = this.createSocket();
      }
    }
    return this.socket;
  }

  getSocket(): Socket | null {
    return this.ensureSocket();
  }

  registerHook(hookId: string): Socket | null {
    this.activeHooks.add(hookId);
    // Don't create socket immediately, wait for actual listeners
    return this.socket;
  }

  unregisterHook(hookId: string) {
    this.activeHooks.delete(hookId);
    // If no more hooks are active in this tab, disconnect after a delay
    if (this.activeHooks.size === 0) {
      setTimeout(() => {
        if (this.activeHooks.size === 0 && this.activeListeners.size === 0) {
          this.disconnect();
        }
      }, 1000); // Give time for quick re-registrations
    }
  }

  // New method to register actual event listeners
  addListener(eventName: string, listenerId: string): Socket | null {
    const listenerKey = `${eventName}_${listenerId}`;
    this.activeListeners.add(listenerKey);
    // Clear idle timer since we have active listeners
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    
    return this.ensureSocket();
  }

  removeListener(eventName: string, listenerId: string) {
    const listenerKey = `${eventName}_${listenerId}`;
    this.activeListeners.delete(listenerKey);
    // If no more listeners, start idle timer
    if (this.activeListeners.size === 0) {
      this.resetIdleTimer();
    }
  }

  setCurrentUser(username: string | null) {
    if (username !== this.currentUser) {
      this.currentUser = username;
      
      if (username && this.socket?.connected) {
        this.authenticate(username);
      }
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.currentUser = null;
    this.isAuthenticating = false;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getActiveHooksCount(): number {
    return this.activeHooks.size;
  }

  getActiveListenersCount(): number {
    return this.activeListeners.size;
  }
}

interface UseWebSocketAgentsProps {
  onForceDisconnect?: () => void;
  // New prop to control when to actually connect
  connectOnMount?: boolean;
}

const useWebSocketAgents = ({ 
  onForceDisconnect, 
  connectOnMount = false 
}: UseWebSocketAgentsProps = {}) => {
  const { user, setUser } = useUser();
  const hookIdRef = useRef(`hook_${Date.now()}_${Math.random()}`);
  const socketManager = SocketManager.getInstance();

  useEffect(() => {
    const hookId = hookIdRef.current;
    socketManager.registerHook(hookId);

    // Set current user
    socketManager.setCurrentUser(user?.username || null);

    // Handle force logout event
    const handleForceLogout = (_: CustomEvent) => {
      setUser(null);
      if (onForceDisconnect) {
        onForceDisconnect();
      }
    };

    window.addEventListener('forceLogout', handleForceLogout as EventListener);

    // Cleanup function
    return () => {
      window.removeEventListener('forceLogout', handleForceLogout as EventListener);
      socketManager.unregisterHook(hookId);
    };
  }, [user?.username, setUser, onForceDisconnect]);

  // Helper function to add event listeners efficiently
  const addEventListener = useCallback((eventName: string, callback: (data: any) => void) => {
    const listenerId = `${hookIdRef.current}_${eventName}`;
    const socket = socketManager.addListener(eventName, listenerId);
    
    if (socket) {
      socket.on(eventName, callback);
      
      // Return cleanup function
      return () => {
        socket.off(eventName, callback);
        socketManager.removeListener(eventName, listenerId);
      };
    }
    
    return () => {};
  }, []);

  return {
    socket: connectOnMount ? socketManager.getSocket() : null,
    isConnected: socketManager.isConnected(),
    activeConnections: socketManager.getActiveHooksCount(),
    activeListeners: socketManager.getActiveListenersCount(),
    addEventListener, // New helper for efficient event listening
    // Manual connection control
    connect: () => socketManager.getSocket(),
    disconnect: () => socketManager.disconnect(),
  };
};

export default useWebSocketAgents;