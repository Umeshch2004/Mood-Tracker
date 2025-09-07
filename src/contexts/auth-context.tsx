'use client';

import type { Mood, User, MoodValue } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  moods: Mood[];
  login: (email: string, pass: string) => boolean;
  signup: (email: string, pass: string, name: string) => boolean;
  logout: () => void;
  updateUser: (name: string) => void;
  addMood: (mood: MoodValue, note?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadDataFromLocalStorage = useCallback(() => {
    try {
      const currentUserEmail = localStorage.getItem('moodjournal_currentUser');
      if (currentUserEmail) {
        const users = JSON.parse(localStorage.getItem('moodjournal_users') || '{}');
        const userDetails = users[currentUserEmail];
        if (userDetails) {
          setUser({ email: currentUserEmail, name: userDetails.name });
        }

        const allMoods = JSON.parse(localStorage.getItem('moodjournal_moods') || '{}');
        setMoods(allMoods[currentUserEmail] || []);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDataFromLocalStorage();
  }, [loadDataFromLocalStorage]);

  const login = (email: string, pass: string): boolean => {
    const users = JSON.parse(localStorage.getItem('moodjournal_users') || '{}');
    if (users[email] && users[email].password === pass) {
      localStorage.setItem('moodjournal_currentUser', email);
      loadDataFromLocalStorage();
      return true;
    }
    return false;
  };

  const signup = (email: string, pass: string, name: string): boolean => {
    const users = JSON.parse(localStorage.getItem('moodjournal_users') || '{}');
    if (users[email]) {
      return false; // User already exists
    }
    users[email] = { password: pass, name };
    localStorage.setItem('moodjournal_users', JSON.stringify(users));
    localStorage.setItem('moodjournal_currentUser', email);
    loadDataFromLocalStorage();
    return true;
  };

  const logout = () => {
    localStorage.removeItem('moodjournal_currentUser');
    setUser(null);
    setMoods([]);
    router.push('/login');
  };
  
  const updateUser = (name: string) => {
    if (!user) return;
    const users = JSON.parse(localStorage.getItem('moodjournal_users') || '{}');
    if (users[user.email]) {
        users[user.email].name = name;
        localStorage.setItem('moodjournal_users', JSON.stringify(users));
        setUser(prev => prev ? {...prev, name} : null);
    }
  };

  const addMood = (mood: MoodValue, note?: string) => {
    if (!user) return;
    const newMood: Mood = {
        id: new Date().toISOString(),
        mood,
        note,
        timestamp: new Date().toISOString(),
    };
    const allMoods = JSON.parse(localStorage.getItem('moodjournal_moods') || '{}');
    const userMoods = allMoods[user.email] || [];
    const updatedMoods = [newMood, ...userMoods];
    allMoods[user.email] = updatedMoods;
    localStorage.setItem('moodjournal_moods', JSON.stringify(allMoods));
    setMoods(updatedMoods);
  };

  return (
    <AuthContext.Provider value={{ user, loading, moods, login, signup, logout, updateUser, addMood }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
