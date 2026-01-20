import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser, delay } from '../data/mockData';

// ⚙️ MODO DE DESENVOLVIMENTO
export const USE_MOCK_DATA = true;

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
    // Simula login automático em modo mock
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);
  }, []);

  // Função de login
  const login = async (email, password) => {
    await delay(500);
    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  // Função de registro
  const register = async (email, password, displayName) => {
    await delay(500);
    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  // Função de logout
  const signOut = async () => {
    await delay(300);
    setUser(null);
    return { success: true };
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
