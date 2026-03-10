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
    if (!token) return;

    const socketInstance = getSocket(token);
    setSocket(socketInstance);

    const user = getStoredUser();
    const userId = user?.id || user?._id;

    const joinRoom = () => {
      if (userId) {
        socketInstance.emit('join', userId);
        console.log(`[SocketContext] JOINED ROOM: ${userId}`);
      }
    };

    joinRoom();
    socketInstance.on('connect', joinRoom);

    const handleNotification = (payload: any) => {
      console.log('[SocketContext] Notification received:', payload);
      toast({
        title: payload.title || "New Notification",
        description: payload.message || "You have a new update.",
      });
    };

    const handleRealtimeNotification = (payload: any) => {
      console.log('[SocketContext] Real-time Notification:', payload);
      toast({
        title: payload.title || "New Notification",
        description: payload.message || "You have a new update.",
      });
    };

    const handleApplicationUpdate = (payload: any) => {
      console.log('[SocketContext] Application Status Update:', payload);
      toast({
        title: "Application Updated",
        description: `Your application status for ${payload.jobTitle || 'the role'} is now ${payload.status}.`,
      });
    };

    socketInstance.on('notification', handleNotification);
    socketInstance.on('new_notification', handleRealtimeNotification);
    socketInstance.on('applicationStatusUpdated', handleApplicationUpdate);

    return () => {
      socketInstance.off('connect', joinRoom);
      socketInstance.off('notification', handleNotification);
      socketInstance.off('new_notification', handleRealtimeNotification);
      socketInstance.off('applicationStatusUpdated', handleApplicationUpdate);
      socketInstance.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
