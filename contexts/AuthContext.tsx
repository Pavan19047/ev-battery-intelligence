import React, { useContext, useState, useEffect, createContext, ReactNode } from 'react';
import { auth } from '../firebase';
import firebase from 'firebase/compat/app';

interface AuthContextType {
  currentUser: firebase.User | null;
  loading: boolean;
  signup: (email: string, pass: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = (email: string, pass: string) => {
    return auth.createUserWithEmailAndPassword(email, pass);
  };

  const login = (email: string, pass: string) => {
    return auth.signInWithEmailAndPassword(email, pass);
  };

  const logout = () => {
    return auth.signOut();
  };

  const getIdToken = async () => {
    if (currentUser) {
        // Pass true to force a refresh, ensuring a valid token for API calls
        return await currentUser.getIdToken(true);
    }
    return null;
  }

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    getIdToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};