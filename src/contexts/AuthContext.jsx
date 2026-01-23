import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

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
    if (!auth) {
      setLoading(false);
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
    if (!auth) {
      return { success: false, error: 'Firebase não configurado' };
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
    if (!auth || !db) {
      return { success: false, error: 'Firebase não configurado' };
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualiza o nome do usuário no Auth
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      // Salva o usuário no Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        displayName: displayName || '',
        email: email,
        photoURL: null,
        createdAt: serverTimestamp(),
        trips: []
      });
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função de logout
  const logout = async () => {
    if (!auth) {
      return { success: false, error: 'Firebase não configurado' };
    }

    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função para atualizar o nome de exibição
  const updateDisplayName = async (newDisplayName) => {
    if (!auth || !user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      // Atualiza no Firebase Auth
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName
      });

      // Atualiza no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: newDisplayName
      }, { merge: true });

      console.log('[DEBUG] Nome atualizado para:', newDisplayName);
      return { success: true };
    } catch (error) {
      console.error('[ERROR] Erro ao atualizar nome:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateDisplayName
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
