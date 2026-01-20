import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import RoteiroPage from './pages/RoteiroPage';
import FinanceiroPage from './pages/FinanceiroPage';
import HistoriaPage from './pages/HistoriaPage';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Componente de rota pública (redireciona se já autenticado)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/roteiro" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      {/* Rota de login */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } 
      />
      
      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TripProvider>
              <Layout>
                <Navigate to="/roteiro" replace />
              </Layout>
            </TripProvider>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/roteiro"
        element={
          <ProtectedRoute>
            <TripProvider>
              <Layout>
                <RoteiroPage />
              </Layout>
            </TripProvider>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/financeiro"
        element={
          <ProtectedRoute>
            <TripProvider>
              <Layout>
                <FinanceiroPage />
              </Layout>
            </TripProvider>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/historia"
        element={
          <ProtectedRoute>
            <TripProvider>
              <Layout>
                <HistoriaPage />
              </Layout>
            </TripProvider>
          </ProtectedRoute>
        }
      />

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
