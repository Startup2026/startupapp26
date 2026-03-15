import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './api';

const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL?.trim();

const deriveSocketUrl = () => {
  if (configuredSocketUrl) return configuredSocketUrl.replace(/\/$/, '');

  if (API_BASE_URL.startsWith('http')) {
    return API_BASE_URL.replace(/\/api\/?$/, '');
  }

  // In local development with Vite proxy, connect to Vite origin and proxy /socket.io to backend.
  return window.location.origin;
};

const SOCKET_URL = deriveSocketUrl();

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      path: '/socket.io',
      transports: ['websocket', 'polling'], // Enable polling fallback
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (err) => {
        console.error("Socket connection error:", err);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
