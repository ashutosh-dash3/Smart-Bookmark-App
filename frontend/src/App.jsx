import { useState, useEffect, useCallback } from 'react';
import api from './api/axios';
import useSocket from './hooks/useSocket';
import Login from './components/Login';
import Header from './components/Header';
import AddBookmark from './components/AddBookmark';
import BookmarkList from './components/BookmarkList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [addingBookmark, setAddingBookmark] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking auth status...');
      const response = await api.get('/auth/me');
      console.log('✅ Auth response:', response.data);
      setIsAuthenticated(response.data.isAuthenticated);
      setUser(response.data.user);
    } catch (error) {
      console.error('❌ Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await api.get('/bookmarks');
      setBookmarks(response.data);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    }
  };

  const handleBookmarkCreated = useCallback((bookmark) => {
    setBookmarks((prev) => {
      if (prev.find(b => b._id === bookmark._id)) return prev;
      return [bookmark, ...prev];
    });
  }, []);

  const handleBookmarkDeleted = useCallback((id) => {
    setBookmarks((prev) => prev.filter(b => b._id !== id));
  }, []);

  useSocket(user?.id, handleBookmarkCreated, handleBookmarkDeleted);

  const handleAddBookmark = async ({ title, url }) => {
    setAddingBookmark(true);
    try {
      await api.post('/bookmarks', { title, url });
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      alert('Failed to add bookmark. Please try again.');
    } finally {
      setAddingBookmark(false);
    }
  };

  const handleDeleteBookmark = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/bookmarks/${id}`);
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
      alert('Failed to delete bookmark. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setIsAuthenticated(false);
      setUser(null);
      setBookmarks([]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      <main className="max-w-6xl mx-auto p-6">
        <AddBookmark onAdd={handleAddBookmark} loading={addingBookmark} />
        <BookmarkList 
          bookmarks={bookmarks} 
          onDelete={handleDeleteBookmark}
          deletingId={deletingId}
        />
      </main>
    </div>
  );
}

export default App;
