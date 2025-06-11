import { useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUser } from '../context/userContext';
import { removeToken } from '../services/authService';

const SOCKET_URL = import.meta.env.VITE_API_URL;

// Improved socket manager with better connection control
class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private activeHooks = new Set<string>();
  private activeListeners = new Set<string>();
  private currentUser: string | null = null;
  private isAuthenticating = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private lastActivity = 0;
  private connectionAttempts = 0;
  
  // More conservative configuration
  private readonly IDLE_TIMEOUT = 60000; // Increased to 60 seconds
  private readonly RECONNECT_DELAY = 5000; // Increased delay
  private readonly MAX_RECONNECT_ATTEMPTS = 3; // Max attempts before giving up
  private readonly RECONNECT_BACKOFF = 1.5; // Exponential backoff multiplier

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  private constructor() {
    if (!window.name) {
      window.name = `tab_${Date.now()}_${Math.random()}`;
    }
  }

  private createSocket(): Socket {
    // Clear any existing socket first
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 15000, // Increased timeout
      reconnection: false, // We'll handle reconnection manually
      forceNew: true,
      upgrade: true,
      rememberUpgrade: true,
      // Connection state recovery is handled manually
    });

    newSocket.on('connect', () => {
      //console.log('🔗 WebSocket connected');
      this.connectionAttempts = 0; // Reset on successful connection
      this.updateActivity();
      
      if (this.currentUser && !this.isAuthenticating) {
        this.authenticate(this.currentUser);
      }
    });

    newSocket.on('disconnect', (reason) => {
      //console.log('🔌 WebSocket disconnected:', reason);
      this.isAuthenticating = false;
      
      // Only auto-reconnect for specific reasons and if we have active listeners
      const shouldReconnect = this.activeListeners.size > 0 && 
        this.connectionAttempts < this.MAX_RECONNECT_ATTEMPTS &&
        (reason === 'io server disconnect' || 
         reason === 'transport close' || 
         reason === 'ping timeout');
      
      if (shouldReconnect) {
        this.scheduleReconnect();
      } else if (this.connectionAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
        //console.warn('🚫 Max reconnection attempts reached, stopping reconnection');
      }
    });

    newSocket.on('connect_error', (error) => {
      //console.error('🔥 WebSocket connection error:', error);
      this.isAuthenticating = false;
      this.connectionAttempts++;
      
      if (this.activeListeners.size > 0 && this.connectionAttempts < this.MAX_RECONNECT_ATTEMPTS) {
        this.scheduleReconnect();
      }
    });

    newSocket.on('authenticate_response', (data) => {
      //console.log('✅ Authentication response:', data);
      this.isAuthenticating = false;
      this.updateActivity();
    });

    newSocket.on('forceDisconnect', (data: any) => {
      //console.log('🚫 Force disconnect received');
      removeToken();
      this.currentUser = null;
      this.disconnect();
      window.dispatchEvent(new CustomEvent('forceLogout', { detail: data }));
    });

    // Throttle activity updates
    let activityThrottle: ReturnType<typeof setTimeout> | null = null;
    newSocket.onAny(() => {
      if (!activityThrottle) {
        activityThrottle = setTimeout(() => {
          this.updateActivity();
          activityThrottle = null;
        }, 1000); // Throttle to once per second
      }
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

    if (this.socket?.connected && this.activeListeners.size === 0) {
      this.idleTimer = setTimeout(() => {
        //console.log('💤 Disconnecting due to inactivity');
        this.disconnect();
      }, this.IDLE_TIMEOUT);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    // Exponential backoff
    const delay = this.RECONNECT_DELAY * Math.pow(this.RECONNECT_BACKOFF, this.connectionAttempts);
    //console.log(`⏰ Scheduling reconnect in ${delay}ms (attempt ${this.connectionAttempts + 1})`);

    this.reconnectTimer = setTimeout(() => {
      if (this.activeListeners.size > 0 && (!this.socket || !this.socket.connected)) {
        //console.log('🔄 Attempting to reconnect...');
        this.socket = this.createSocket();
      }
    }, delay);
  }

  private authenticate(username: string) {
    if (!this.socket || !this.socket.connected || this.isAuthenticating) {
      return;
    }

    //console.log('🔐 Authenticating user:', username);
    this.isAuthenticating = true;
    this.socket.emit('authenticate', { username });
    
    // Clear authentication flag after timeout
    setTimeout(() => {
      if (this.isAuthenticating) {
        //console.warn('⚠️ Authentication timeout');
        this.isAuthenticating = false;
      }
    }, 10000); // Increased timeout
  }

  private ensureSocket(): Socket | null {
    if (!this.socket || this.socket.disconnected) {
      if (this.activeListeners.size > 0 || this.activeHooks.size > 0) {
        if (this.connectionAttempts < this.MAX_RECONNECT_ATTEMPTS) {
          this.socket = this.createSocket();
        }
      }
    }
    return this.socket;
  }

  getSocket(): Socket | null {
    return this.ensureSocket();
  }

  registerHook(hookId: string): Socket | null {
    //console.log('📌 Registering hook:', hookId);
    this.activeHooks.add(hookId);
    return this.socket;
  }

  unregisterHook(hookId: string) {
    //console.log('📌 Unregistering hook:', hookId);
    this.activeHooks.delete(hookId);
    
    // Increased delay for cleanup
    if (this.activeHooks.size === 0) {
      setTimeout(() => {
        if (this.activeHooks.size === 0 && this.activeListeners.size === 0) {
          //console.log('🧹 No active hooks or listeners, disconnecting');
          this.disconnect();
        }
      }, 5000); // Increased cleanup delay
    }
  }

  addListener(eventName: string, listenerId: string): Socket | null {
    const listenerKey = `${eventName}_${listenerId}`;
    //console.log('👂 Adding listener:', listenerKey);
    this.activeListeners.add(listenerKey);
    
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    
    return this.ensureSocket();
  }

  removeListener(eventName: string, listenerId: string) {
    const listenerKey = `${eventName}_${listenerId}`;
    //console.log('👂 Removing listener:', listenerKey);
    this.activeListeners.delete(listenerKey);
    
    if (this.activeListeners.size === 0) {
      this.resetIdleTimer();
    }
  }

  setCurrentUser(username: string | null) {
    if (username !== this.currentUser) {
      //console.log('👤 Setting current user:', username);
      this.currentUser = username;
      
      if (username && this.socket?.connected) {
        this.authenticate(username);
      }
    }
  }

  disconnect() {
    //console.log('🔌 Disconnecting socket manager');
    
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
    this.connectionAttempts = 0;
  }

  // Reset connection attempts (useful after successful reconnection)
  resetConnectionAttempts() {
    this.connectionAttempts = 0;
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

  getConnectionAttempts(): number {
    return this.connectionAttempts;
  }
}

interface UseWebSocketAgentsProps {
  onForceDisconnect?: () => void;
  connectOnMount?: boolean;
}

const useWebSocketAgents = ({ 
  onForceDisconnect, 
  connectOnMount = false 
}: UseWebSocketAgentsProps = {}) => {
  const { user, setUser } = useUser();
  const hookIdRef = useRef(`hook_${Date.now()}_${Math.random()}`);
  const socketManager = SocketManager.getInstance();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const hookId = hookIdRef.current;
    socketManager.registerHook(hookId);

    // Only set user if we have one and should connect
    if (user?.username && connectOnMount) {
      socketManager.setCurrentUser(user.username);
    }

    const handleForceLogout = (_: CustomEvent) => {
      setUser(null);
      if (onForceDisconnect) {
        onForceDisconnect();
      }
    };

    window.addEventListener('forceLogout', handleForceLogout as EventListener);

    return () => {
      window.removeEventListener('forceLogout', handleForceLogout as EventListener);
      socketManager.unregisterHook(hookId);
      isInitializedRef.current = false;
    };
  }, []); // Empty dependency array to prevent re-runs

  // Separate effect for user changes
  useEffect(() => {
    if (connectOnMount && user?.username) {
      socketManager.setCurrentUser(user.username);
    } else if (!user) {
      socketManager.setCurrentUser(null);
    }
  }, [user?.username, connectOnMount]);

  const addEventListener = useCallback((eventName: string, callback: (data: any) => void) => {
    const listenerId = `${hookIdRef.current}_${eventName}_${Date.now()}`;
    const socket = socketManager.addListener(eventName, listenerId);
    
    if (socket) {
      socket.on(eventName, callback);
      
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
    connectionAttempts: socketManager.getConnectionAttempts(),
    addEventListener,
    connect: () => socketManager.getSocket(),
    disconnect: () => socketManager.disconnect(),
    resetConnectionAttempts: () => socketManager.resetConnectionAttempts(),
  };
};

export default useWebSocketAgents;