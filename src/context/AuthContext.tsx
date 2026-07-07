import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { IUser, IArticle } from '../types';

interface AuthContextType {
  token: string | null;
  user: IUser | null;
  bookmarks: IArticle[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    interests: string[];
    preferredCategories: string[];
  }) => Promise<void>;
  logout: () => void;
  updatePreferences: (interests: string[], categories: string[]) => Promise<void>;
  fetchBookmarks: () => Promise<void>;
  toggleBookmark: (articleId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('newsmania_token'));
  const [user, setUser] = useState<IUser | null>(null);
  const [bookmarks, setBookmarks] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Configure Axios with token
  useEffect(() => {
    if (token) {
      localStorage.setItem('newsmania_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      localStorage.removeItem('newsmania_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setBookmarks([]);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data.user);
      fetchBookmarks();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get('/api/news/bookmarks');
      setBookmarks(response.data.bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
  };

  const register = async (data: any) => {
    const response = await axios.post('/api/auth/register', data);
    setToken(response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setBookmarks([]);
  };

  const updatePreferences = async (interests: string[], categories: string[]) => {
    try {
      const response = await axios.put('/api/auth/profile', {
        interests,
        preferredCategories: categories
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const toggleBookmark = async (articleId: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await axios.post('/api/news/bookmarks/toggle', { articleId });
      fetchBookmarks(); // Refresh bookmark list
      return response.data.bookmarked;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        bookmarks,
        loading,
        login,
        register,
        logout,
        updatePreferences,
        fetchBookmarks,
        toggleBookmark
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
