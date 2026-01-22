import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

// Contexto da viagem
const TripContext = createContext({});

// Hook customizado
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
  const [currentTrip, setCurrentTrip] = useState(null);
  const [events, setEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [participantsData, setParticipantsData] = useState({});
  const [loading, setLoading] = useState(true);

  // Monitora a viagem atual do usuário
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!db) {
      setLoading(false);
      return;
    }

    const tripsRef = collection(db, 'trips');
    const q = query(
      tripsRef, 
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const tripData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setCurrentTrip(tripData);
        setParticipants(tripData.participants || []);
      }
      setLoading(false);
    }, (error) => {
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Monitora eventos da viagem
  useEffect(() => {
    if (!currentTrip || !db) return;

    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('tripId', '==', currentTrip.id),
      orderBy('date', 'asc')
    );

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
    if (!currentTrip || !db) return;

    const expensesRef = collection(db, 'expenses');
    const q = query(
      expensesRef,
      where('tripId', '==', currentTrip.id),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expensesData);
    });

    return unsubscribe;
  }, [currentTrip]);

  // Busca dados dos participantes
  useEffect(() => {
    if (!currentTrip || !db) return;
    
    const fetchParticipants = async () => {
      const data = {};
      for (const uid of currentTrip.participants) {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            data[uid] = userDoc.data();
          } else {
            // Fallback se usuário não existe no Firestore
            data[uid] = {
              displayName: uid.substring(0, 8) + '...',
              email: 'Usuário'
            };
          }
        } catch (error) {

          data[uid] = {
            displayName: uid.substring(0, 8) + '...',
            email: 'Usuário'
          };
        }
      }
      setParticipantsData(data);
    };
    
    fetchParticipants();
  }, [currentTrip]);

  // ========== CRIAR VIAGEM ==========

  const createTrip = async (tripData) => {
    if (!user || !db) return { success: false, error: 'Usuário não autenticado' };

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

  // ========== ATUALIZAR VIAGEM ==========

  const updateTrip = async (tripId, tripData) => {
    if (!user || !db) return { success: false, error: 'Usuário não autenticado' };

    try {
      const tripRef = doc(db, 'trips', tripId);
      await updateDoc(tripRef, {
        ...tripData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ========== ADICIONAR PARTICIPANTE ==========

  const addParticipant = async (tripId, participantEmail) => {
    if (!user || !db) return { success: false, error: 'Usuário não autenticado' };

    try {
      // Validação de entrada
      if (!participantEmail || !participantEmail.includes('@')) {
        throw new Error('E-mail inválido');
      }

      // Verificar se o usuário atual é participante da viagem
      const tripRef = doc(db, 'trips', tripId);
      const tripDoc = await getDoc(tripRef);
      
      if (!tripDoc.exists()) {
        throw new Error('Viagem não encontrada');
      }

      const tripData = tripDoc.data();
      if (!tripData.participants.includes(user.uid)) {
        throw new Error('Você não tem permissão para adicionar participantes');
      }

      // Buscar usuário pelo email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', participantEmail.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Usuário não encontrado com este e-mail');
      }

      const userDoc = querySnapshot.docs[0];
      const participantId = userDoc.id;

      // Verificar se já é participante
      if (tripData.participants.includes(participantId)) {
        throw new Error('Este usuário já é participante da viagem');
      }

      // Adicionar participante
      await updateDoc(tripRef, {
        participants: arrayUnion(participantId),
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // ========== REMOVER PARTICIPANTE ==========

  const removeParticipant = async (tripId, participantId) => {
    if (!user || !db) return { success: false, error: 'Usuário não autenticado' };

    try {
      // Verificar permissões
      const tripRef = doc(db, 'trips', tripId);
      const tripDoc = await getDoc(tripRef);
      
      if (!tripDoc.exists()) {
        throw new Error('Viagem não encontrada');
      }

      const tripData = tripDoc.data();
      
      // Verificar se o usuário atual é participante
      if (!tripData.participants.includes(user.uid)) {
        throw new Error('Você não tem permissão para remover participantes');
      }

      // Não permitir remover o criador da viagem
      if (participantId === tripData.createdBy) {
        throw new Error('Não é possível remover o criador da viagem');
      }

      // Remover participante
      await updateDoc(tripRef, {
        participants: arrayRemove(participantId),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ========== OPERAÇÕES COM EVENTOS ==========

  const addEvent = async (eventData) => {
    if (!currentTrip || !db) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      console.log('Adicionando evento:', eventData);
      console.log('Trip ID:', currentTrip.id);
      console.log('User ID:', user.uid);

      const eventsRef = collection(db, 'events');
      await addDoc(eventsRef, {
        ...eventData,
        tripId: currentTrip.id,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      console.log('Evento adicionado com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
      return { success: false, error: error.message };
    }
  };

  const updateEvent = async (eventId, eventData) => {
    if (!currentTrip || !db) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      console.log('Atualizando evento:', eventId, eventData);
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: serverTimestamp()
      });
      console.log('Evento atualizado com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteEvent = async (eventId) => {
    if (!currentTrip || !db) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ========== OPERAÇÕES COM DESPESAS ==========

  const addExpense = async (expenseData) => {
    if (!currentTrip || !db) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      console.log('Adicionando despesa:', expenseData);
      console.log('Participantes atuais:', participants);

      // Validações de segurança
      if (!expenseData.amount || expenseData.amount <= 0) {
        throw new Error('Valor da despesa deve ser maior que zero');
      }

      if (!expenseData.paidBy || !participants.includes(expenseData.paidBy)) {
        throw new Error(`Pagador inválido. paidBy=${expenseData.paidBy}, participants=${participants}`);
      }

      if (!expenseData.splitBetween || expenseData.splitBetween.length === 0) {
        throw new Error('Selecione pelo menos um participante para dividir a despesa');
      }

      // Validar que todos em splitBetween são participantes válidos
      const invalidParticipants = expenseData.splitBetween.filter(
        id => !participants.includes(id)
      );
      if (invalidParticipants.length > 0) {
        throw new Error(`Participantes inválidos na divisão: ${invalidParticipants}`);
      }

      const expensesRef = collection(db, 'expenses');
      await addDoc(expensesRef, {
        ...expenseData,
        amount: Number(expenseData.amount), // Garantir que é número
        tripId: currentTrip.id,
        createdAt: serverTimestamp()
      });
      console.log('Despesa adicionada com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      return { success: false, error: error.message };
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    if (!currentTrip || !db) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      console.log('Atualizando despesa:', expenseId, expenseData);
      const expenseRef = doc(db, 'expenses', expenseId);
      await updateDoc(expenseRef, {
        ...expenseData,
        amount: Number(expenseData.amount),
        updatedAt: serverTimestamp()
      });
      console.log('Despesa atualizada com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteExpense = async (expenseId) => {
    if (!currentTrip || !db) return { success: false, error: 'Nenhuma viagem selecionada' };

    try {
      const expenseRef = doc(db, 'expenses', expenseId);
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
    participantsData,
    loading,
    createTrip,
    updateTrip,
    addParticipant,
    removeParticipant,
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
