import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false); // 🔥 prevent flicker

  // 🔹 Load saved user when app starts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('Load user error:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadUser();
  }, []);

  // 🔹 Login (SAVE to storage)
  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.log('Login save error:', error);
    }
  };

  // 🔹 Logout (REMOVE from storage)
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');

      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // 🔥 Prevent app rendering before loading user
  if (!isReady) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);