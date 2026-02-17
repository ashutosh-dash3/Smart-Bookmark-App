import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userId, onBookmarkCreated, onBookmarkDeleted) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      withCredentials: true
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
