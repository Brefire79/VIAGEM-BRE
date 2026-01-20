import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

// Contexto da viagem
const TripContext = createContext({});

// Hook customizado para usar o contexto da viagem
export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip deve ser usado dentro de um TripProvider');
  }
  return context;
};

// Provider da viagem
export const TripProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentTrip, setCurrentTrip] = useState(USE_MOCK_DATA ? mockTrip : null);
  const [events, setEvents] = useState(USE_MOCK_DATA ? mockEvents : []);
  const [expenses, setExpenses] = useState(USE_MOCK_DATA ? mockExpenses : []);
  const [participants, setParticipants] = useState(USE_MOCK_DATA ? mockParticipants : []);
  const [loading, setLoading] = useState(!USE_MOCK_DATA);

  // Monitora a viagem atual do usuário
  useEffect(() => {
    if (USE_MOCK_DATA) {
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    // Por simplicidade, vamos buscar a primeira viagem do usuário
    // Em produção, você teria uma tela de seleção de viagens
    const tripsRef = collection(db, 'trips');
    const q = query(
      tripsRef, 
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const tripData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setCurrentTrip(tripData);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Monitora eventos da viagem
  useEffect(() => {
    if (!currentTrip) return;

    const eventsRef = collection(db, 'trips', currentTrip.id, 'events');
    const q = query(eventsRef, orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    });

    return unsubscribe;
  }, [currentTrip]);

  // Monitora despesas da viagem
  useEffect(() => {
    if (!currentTrip) return;

    const expensesRef = collection(db, 'trips', currentTrip.id, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expensesData);
    });

    return unsubscribe;
  }, [currentTrip]);

  // Carrega participantes
  useEffect(() => {
    if (!currentTrip) return;
    
    // Em produção, você buscaria os dados completos dos participantes
    // Por agora, vamos simular com os IDs
    setParticipants(currentTrip.participants || []);
  }, [currentTrip]);

  // Criar nova viagem
  const createTrip = async (tripData) => {
    try {
      const tripsRef = collection(db, 'trips');
      const docRef = await addDoc(tripsRef, {
        ...tripData,
        participants: [user.uid],
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      return { success: true, tripId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Adicionar evento ao roteiro
  const addEvent = async (eventData) => {
    if (!currentTrip) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      const eventsRef = collection(db, 'trips', currentTrip.id, 'events');
      await addDoc(eventsRef, {
        ...eventData,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Atualizar evento
  const updateEvent = async (eventId, eventData) => {
    if (!currentTrip) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      const eventRef = doc(db, 'trips', currentTrip.id, 'events', eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Deletar evento
  const deleteEvent = async (eventId) => {
    if (!currentTrip) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      const eventRef = doc(db, 'trips', currentTrip.id, 'events', eventId);
      await deleteDoc(eventRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Adicionar despesa
  const addExpense = async (expenseData) => {
    if (!currentTrip) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      const expensesRef = collection(db, 'trips', currentTrip.id, 'expenses');
      await addDoc(expensesRef, {
        ...expenseData,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Atualizar despesa
  const updateExpense = async (expenseId, expenseData) => {
    if (!currentTrip) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      const expenseRef = doc(db, 'trips', currentTrip.id, 'expenses', expenseId);
      await updateDoc(expenseRef, {
        ...expenseData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Deletar despesa
  const deleteExpense = async (expenseId) => {
    if (!currentTrip) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      const expenseRef = doc(db, 'trips', currentTrip.id, 'expenses', expenseId);
      await deleteDoc(expenseRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentTrip,
    events,
    expenses,
    participants,
    loading,
    createTrip,
    addEvent,
    updateEvent,
    deleteEvent,
    addExpense,
    updateExpense,
    deleteExpense
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};
