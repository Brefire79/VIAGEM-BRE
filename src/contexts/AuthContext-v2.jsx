import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser, delay } from '../data/mockData';

// ⚙️ MODO DE DESENVOLVIMENTO - DEFINA AQUI!
export const USE_MOCK_DATA = true;

// Imports condicionais do Firebase
let signInWithEmailAndPassword, createUserWithEmailAndPassword, firebaseSignOut, onAuthStateChanged, updateProfile, auth;

if (!USE_MOCK_DATA) {
  const firebaseAuth = await import('firebase/auth');
  const firebase = await import('../firebase');
  
  signInWithEmailAndPassword = firebaseAuth.signInWithEmailAndPassword;
  createUserWithEmailAndPassword = firebaseAuth.createUserWithEmailAndPassword;
  firebaseSignOut = firebaseAuth.signOut;
  onAuthStateChanged = firebaseAuth.onAuthStateChanged;
  updateProfile = firebaseAuth.updateProfile;
  auth = firebase.auth;
}

// Contexto de autenticação
const AuthContext = createContext({});

// Hook customizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitora mudanças no estado de autenticação
  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Simula login automático
      setTimeout(() => {
        setUser(mockUser);
        setLoading(false);
      }, 500);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Função de login
  const login = async (email, password) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      setUser(mockUser);
      return { success: true, user: mockUser };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função de registro
  const register = async (email, password, displayName) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      setUser(mockUser);
      return { success: true, user: mockUser };
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função de logout
  const signOut = async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      setUser(null);
      return { success: true };
    }

    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
