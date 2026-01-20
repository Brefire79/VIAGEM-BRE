// Configuração do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚙️ MODO DE DESENVOLVIMENTO
// Se true, não inicializa o Firebase (usa dados mock)
const USE_MOCK_DATA = true;

// Suas credenciais do Firebase (configure no arquivo .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
};

// Inicializa o Firebase apenas se não estiver em modo mock
let app, auth, db;

if (!USE_MOCK_DATA) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Em modo mock, exporta objetos vazios para evitar erros
  app = null;
  auth = null;
  db = null;
}

// Exporta as instâncias
export { auth, db };
export default app;
