import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../api/axios';

/**
 * Socket.io Hook for Real-time Updates
 * 
 * Connects to the backend Socket.io server for real-time bookmark updates.
 * Uses the same API_BASE_URL as the REST API.
 */

const useSocket = (userId, onBookmarkCreated, onBookmarkDeleted) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join', userId);
    });

    socket.on('bookmark:created', (bookmark) => {
      onBookmarkCreated(bookmark);
    });

    socket.on('bookmark:deleted', ({ id }) => {
      onBookmarkDeleted(id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, onBookmarkCreated, onBookmarkDeleted]);

  return socketRef.current;
};

export default useSocket;
