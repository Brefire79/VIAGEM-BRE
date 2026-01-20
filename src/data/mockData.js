/**
 * 🎭 DADOS MOCK PARA DESENVOLVIMENTO
 * Simula dados do Firebase para testar o app sem configuração
 */

// Usuário mock
export const mockUser = {
  uid: 'user-123',
  email: 'teste@viagem.com',
  displayName: 'Viajante Demo'
};

// Viagem mock
export const mockTrip = {
  id: 'trip-001',
  name: 'Viagem para Paris',
  destination: 'Paris, França',
  startDate: new Date('2026-03-15'),
  endDate: new Date('2026-03-22'),
  participants: ['user-123', 'user-456'],
  createdAt: new Date('2026-01-15')
};

// Participantes mock
export const mockParticipants = ['user-123', 'user-456'];

// Eventos mock
export const mockEvents = [
  {
    id: 'event-001',
    tripId: 'trip-001',
    type: 'voo',
    title: 'Voo São Paulo → Paris',
    description: 'Air France AF456 - Saída às 22:30',
    date: new Date(2026, 2, 15, 22, 30), // 15 de março de 2026, 22:30
    time: '22:30',
    location: 'Aeroporto GRU - Terminal 3',
    createdBy: 'user-123',
    createdAt: new Date('2026-01-15')
  },
  {
    id: 'event-002',
    tripId: 'trip-001',
    type: 'transfer',
    title: 'Transfer Aeroporto → Hotel',
    description: 'Uber reservado pelo app',
    date: new Date(2026, 2, 16, 11, 0), // 16 de março de 2026, 11:00
    time: '11:00',
    location: 'Aeroporto Charles de Gaulle',
    createdBy: 'user-123',
    createdAt: new Date('2026-01-15')
  },
  {
    id: 'event-003',
    tripId: 'trip-001',
    type: 'hospedagem',
    title: 'Check-in Hotel Le Marais',
    description: 'Reserva confirmada - Quarto duplo com vista',
    date: new Date(2026, 2, 16, 14, 0), // 16 de março de 2026, 14:00
    time: '14:00',
    location: 'Rue de Rivoli, 75004 Paris',
    createdBy: 'user-123',
    createdAt: new Date('2026-01-15')
  },
  {
    id: 'event-004',
    tripId: 'trip-001',
    type: 'passeio',
    title: 'Torre Eiffel',
    description: 'Ingressos para o topo - Horário reservado',
    date: new Date(2026, 2, 17, 10, 0), // 17 de março de 2026, 10:00
    time: '10:00',
    location: 'Champ de Mars, Paris',
    createdBy: 'user-456',
    createdAt: new Date('2026-01-16')
  },
  {
    id: 'event-005',
    tripId: 'trip-001',
    type: 'alimentacao',
    title: 'Almoço no Le Jules Verne',
    description: 'Restaurante na Torre Eiffel - Mesa reservada',
    date: new Date(2026, 2, 17, 13, 0), // 17 de março de 2026, 13:00
    time: '13:00',
    location: 'Torre Eiffel, 2º andar',
    createdBy: 'user-456',
    createdAt: new Date('2026-01-16')
  },
  {
    id: 'event-006',
    tripId: 'trip-001',
    type: 'passeio',
    title: 'Museu do Louvre',
    description: 'Tour guiado em português - Mona Lisa e obras principais',
    date: new Date(2026, 2, 18, 9, 0), // 18 de março de 2026, 09:00
    time: '09:00',
    location: 'Rue de Rivoli, 75001 Paris',
    createdBy: 'user-123',
    createdAt: new Date('2026-01-17')
  },
  {
    id: 'event-007',
    tripId: 'trip-001',
    type: 'passeio',
    title: 'Cruzeiro no Rio Sena',
    description: 'Passeio ao pôr do sol com jantar incluído',
    date: new Date(2026, 2, 19, 18, 30), // 19 de março de 2026, 18:30
    time: '18:30',
    location: 'Port de la Bourdonnais',
    createdBy: 'user-456',
    createdAt: new Date('2026-01-17')
  },
  {
    id: 'event-008',
    tripId: 'trip-001',
    type: 'passeio',
    title: 'Versalhes',
    description: 'Palácio de Versalhes e jardins - Day trip',
    date: new Date(2026, 2, 20, 8, 0), // 20 de março de 2026, 08:00
    time: '08:00',
    location: 'Château de Versailles',
    createdBy: 'user-123',
    createdAt: new Date('2026-01-18')
  },
  {
    id: 'event-009',
    tripId: 'trip-001',
    type: 'transfer',
    title: 'Transfer Hotel → Aeroporto',
    description: 'Uber agendado',
    date: new Date(2026, 2, 22, 8, 0), // 22 de março de 2026, 08:00
    time: '08:00',
    location: 'Hotel Le Marais',
    createdBy: 'user-123',
    createdAt: new Date('2026-01-18')
  },
  {
    id: 'event-010',
    tripId: 'trip-001',
    type: 'voo',
    title: 'Voo Paris → São Paulo',
    description: 'Air France AF459 - Decolagem às 11:45',
    date: new Date(2026, 2, 22, 11, 45), // 22 de março de 2026, 11:45
    time: '11:45',
    location: 'Aeroporto Charles de Gaulle',
    createdBy: 'user-123',
    createdAt: new Date('2026-01-18')
  }
];

// Despesas mock
export const mockExpenses = [
  {
    id: 'expense-001',
    tripId: 'trip-001',
    category: 'aereo',
    description: 'Passagens aéreas GRU-CDG-GRU',
    amount: 6500.00,
    paidBy: 'user-123',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-10'),
    createdAt: new Date('2026-01-10')
  },
  {
    id: 'expense-002',
    tripId: 'trip-001',
    category: 'hospedagem',
    description: 'Hotel Le Marais - 6 noites',
    amount: 4200.00,
    paidBy: 'user-456',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-12'),
    createdAt: new Date('2026-01-12')
  },
  {
    id: 'expense-003',
    tripId: 'trip-001',
    category: 'passeios',
    description: 'Ingressos Torre Eiffel (2 pessoas)',
    amount: 180.00,
    paidBy: 'user-123',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-15'),
    createdAt: new Date('2026-01-15')
  },
  {
    id: 'expense-004',
    tripId: 'trip-001',
    category: 'alimentacao',
    description: 'Restaurante Le Jules Verne',
    amount: 850.00,
    paidBy: 'user-456',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-15'),
    createdAt: new Date('2026-01-15')
  },
  {
    id: 'expense-005',
    tripId: 'trip-001',
    category: 'passeios',
    description: 'Museu do Louvre - Ingressos + Tour',
    amount: 320.00,
    paidBy: 'user-123',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-16'),
    createdAt: new Date('2026-01-16')
  },
  {
    id: 'expense-006',
    tripId: 'trip-001',
    category: 'transfer',
    description: 'Transfers Uber em Paris',
    amount: 420.00,
    paidBy: 'user-123',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-16'),
    createdAt: new Date('2026-01-16')
  },
  {
    id: 'expense-007',
    tripId: 'trip-001',
    category: 'passeios',
    description: 'Cruzeiro no Sena com jantar',
    amount: 680.00,
    paidBy: 'user-456',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-17'),
    createdAt: new Date('2026-01-17')
  },
  {
    id: 'expense-008',
    tripId: 'trip-001',
    category: 'passeios',
    description: 'Versalhes - Ingressos e transporte',
    amount: 380.00,
    paidBy: 'user-123',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-17'),
    createdAt: new Date('2026-01-17')
  },
  {
    id: 'expense-009',
    tripId: 'trip-001',
    category: 'alimentacao',
    description: 'Restaurantes e cafés diversos',
    amount: 1200.00,
    paidBy: 'user-456',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-18'),
    createdAt: new Date('2026-01-18')
  },
  {
    id: 'expense-010',
    tripId: 'trip-001',
    category: 'outros',
    description: 'Souvenirs e compras',
    amount: 650.00,
    paidBy: 'user-123',
    splitBetween: ['user-123', 'user-456'],
    date: new Date('2026-01-18'),
    createdAt: new Date('2026-01-18')
  }
];

// Funções auxiliares para simular operações assíncronas
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Gera ID único
export const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
