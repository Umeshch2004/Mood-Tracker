'use client';

import type { User, Entry } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  entries: Entry[];
  login: (email: string, pass: string) => boolean;
  signup: (email: string, pass: string, name: string) => boolean;
  logout: () => void;
  updateUser: (name: string) => void;
  addEntry: (entry: Omit<Entry, 'id'>) => void;
  updateEntry: (entry: Entry) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => Entry | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadDataFromLocalStorage = useCallback(() => {
    try {
      const currentUserEmail = localStorage.getItem('healthjournal_currentUser');
      if (currentUserEmail) {
        const users = JSON.parse(localStorage.getItem('healthjournal_users') || '{}');
        const userDetails = users[currentUserEmail];
        if (userDetails) {
          setUser({ email: currentUserEmail, name: userDetails.name });
        }

        const allEntries = JSON.parse(localStorage.getItem('healthjournal_entries') || '{}');
        const userEntries = allEntries[currentUserEmail] || [];
        // Sort entries by date descending
        userEntries.sort((a: Entry, b: Entry) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(userEntries);
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

  const saveData = (newEntries: Entry[]) => {
    if (!user) return;
    const allEntries = JSON.parse(localStorage.getItem('healthjournal_entries') || '{}');
    allEntries[user.email] = newEntries;
    localStorage.setItem('healthjournal_entries', JSON.stringify(allEntries));
    // Sort entries by date descending
    newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEntries(newEntries);
  }

  const login = (email: string, pass: string): boolean => {
    const users = JSON.parse(localStorage.getItem('healthjournal_users') || '{}');
    if (users[email] && users[email].password === pass) {
      localStorage.setItem('healthjournal_currentUser', email);
      loadDataFromLocalStorage();
      return true;
    }
    return false;
  };

  const signup = (email: string, pass: string, name: string): boolean => {
    const users = JSON.parse(localStorage.getItem('healthjournal_users') || '{}');
    if (users[email]) {
      return false; // User already exists
    }
    users[email] = { password: pass, name };
    localStorage.setItem('healthjournal_users', JSON.stringify(users));
    localStorage.setItem('healthjournal_currentUser', email);
    loadDataFromLocalStorage();
    return true;
  };

  const logout = () => {
    localStorage.removeItem('healthjournal_currentUser');
    setUser(null);
    setEntries([]);
    router.push('/login');
  };
  
  const updateUser = (name: string) => {
    if (!user) return;
    const users = JSON.parse(localStorage.getItem('healthjournal_users') || '{}');
    if (users[user.email]) {
        users[user.email].name = name;
        localStorage.setItem('healthjournal_users', JSON.stringify(users));
        setUser(prev => prev ? {...prev, name} : null);
    }
  };

  const addEntry = (entry: Omit<Entry, 'id'>) => {
    const newEntry = { ...entry, id: new Date().toISOString() };
    const updatedEntries = [...entries, newEntry];
    saveData(updatedEntries);
  };

  const updateEntry = (updatedEntry: Entry) => {
    const updatedEntries = entries.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry);
    saveData(updatedEntries);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    saveData(updatedEntries);
  };
  
  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  }

  return (
    <AuthContext.Provider value={{ user, loading, entries, login, signup, logout, updateUser, addEntry, updateEntry, deleteEntry, getEntry }}>
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
