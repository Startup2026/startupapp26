import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';
import { getAuthToken, getStoredUser } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const socketInstance = getSocket(token);
      setSocket(socketInstance);
      
      const user = getStoredUser();
      const userId = user?.id || user?._id; 
      
      if (userId) {
          socketInstance.emit('join', userId);
          console.log(`[SocketContext] JOINED ROOM: ${userId}`);
      }

      // Re-join on connect
      socketInstance.on('connect', () => {
          if (userId) socketInstance.emit('join', userId);
      });

      // Global Notification Listener
      socketInstance.on('notification', (payload: any) => {
        console.log('[SocketContext] Notification received:', payload);
        toast({
          title: payload.title || "New Notification",
          description: payload.message || "You have a new update.",
        });
      });

      // Listening for the new real-time notifications
      socketInstance.on('new_notification', (payload: any) => {
        console.log('[SocketContext] Real-time Notification:', payload);
        toast({
          title: payload.title || "New Notification",
          description: payload.message || "You have a new update.",
          variant: "default",
        });
      });

      // Special handling for application status updates
      socketInstance.on('applicationStatusUpdated', (payload: any) => {
        console.log('[SocketContext] Application Status Update:', payload);
        toast({
          title: "Application Updated",
          description: `Your application status for ${payload.jobTitle || 'the role'} is now ${payload.status}.`,
        });
      });
    }

    return () => {
      // Cleanup listeners on unmount
      if (socket) {
        socket.off('notification');
        socket.off('applicationStatusUpdated');
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
