import React, { createContext, useContext, useState } from 'react';
import { mockTrip, mockEvents, mockExpenses, mockParticipants, delay, generateId } from '../data/mockData';
import { useAuth } from './AuthContext';

// ⚙️ MODO DE DESENVOLVIMENTO
export const USE_MOCK_DATA = true;

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
  const [currentTrip] = useState(mockTrip);
  const [events, setEvents] = useState(mockEvents);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [participants] = useState(mockParticipants);
  const [loading] = useState(false);

  // ========== OPERAÇÕES COM EVENTOS ==========

  const addEvent = async (eventData) => {
    await delay(300);
    const newEvent = {
      ...eventData,
      id: generateId(),
      tripId: currentTrip.id,
      createdBy: user.uid,
      createdAt: new Date()
    };
    setEvents(prev => [...prev, newEvent]);
    return { success: true, id: newEvent.id };
  };

  const updateEvent = async (eventId, eventData) => {
    await delay(300);
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...eventData } : event
    ));
    return { success: true };
  };

  const deleteEvent = async (eventId) => {
    await delay(300);
    setEvents(prev => prev.filter(event => event.id !== eventId));
    return { success: true };
  };

  // ========== OPERAÇÕES COM DESPESAS ==========

  const addExpense = async (expenseData) => {
    await delay(300);
    const newExpense = {
      ...expenseData,
      id: generateId(),
      tripId: currentTrip.id,
      createdAt: new Date()
    };
    setExpenses(prev => [...prev, newExpense]);
    return { success: true, id: newExpense.id };
  };

  const updateExpense = async (expenseId, expenseData) => {
    await delay(300);
    setExpenses(prev => prev.map(expense => 
      expense.id === expenseId ? { ...expense, ...expenseData } : expense
    ));
    return { success: true };
  };

  const deleteExpense = async (expenseId) => {
    await delay(300);
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    return { success: true };
  };

  const value = {
    currentTrip,
    events,
    expenses,
    participants,
    loading,
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
