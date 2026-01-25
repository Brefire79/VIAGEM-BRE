import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, DollarSign, Users, Activity, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { pageVariants } from '../utils/motionVariants';

const TimelineViagemPage = () => {
  const { currentTrip, events, expenses, participants, participantsData } = useTrip();
  const { user } = useAuth();

  // Combina e ordena eventos e despesas na timeline
  const timelineItems = useMemo(() => {
    if (!currentTrip) return [];

    const items = [];

    // Adicionar eventos
    events.forEach(event => {
      const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
      items.push({
        type: 'event',
        id: event.id,
        date: eventDate,
        title: event.title,
        description: event.description,
        location: event.location,
        eventType: event.type,
        data: event
      });
    });

    // Adicionar despesas
    expenses.forEach(expense => {
      const expenseDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date);
      items.push({
        type: 'expense',
        id: expense.id,
        date: expenseDate,
        title: expense.description,
        amount: expense.amount,
        category: expense.category,
        paidBy: expense.paidBy,
        status: expense.status,
        data: expense
      });
    });

    // Ordenar por data
    items.sort((a, b) => a.date - b.date);

    return items;
  }, [events, expenses, currentTrip]);

  // Ícones por tipo de evento
  const eventIcons = {
    voo: { icon: '✈️', color: 'from-blue-500 to-blue-600' },
    transfer: { icon: '🚗', color: 'from-cyan-500 to-cyan-600' },
    hospedagem: { icon: '🏨', color: 'from-purple-500 to-purple-600' },
    passeio: { icon: '🎯', color: 'from-green-500 to-green-600' },
    alimentacao: { icon: '🍽️', color: 'from-orange-500 to-orange-600' }
  };

  const categoryIcons = {
    aereo: '✈️',
    transfer: '🚗',
    hospedagem: '🏨',
    passeios: '🎯',
    alimentacao: '🍽️',
    outros: '💰'
  };

  if (!currentTrip || timelineItems.length === 0) {
    return (
      <motion.div
        className="max-w-4xl mx-auto pb-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="empty-state">
          <Activity className="w-16 h-16 text-sand-300 mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Sua Timeline Está Vazia</h2>
          <p className="text-sand-500">Comece adicionando eventos e despesas para ver a linha do tempo da sua viagem.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto pb-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-ocean to-aqua rounded-xl flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Calendar className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-dark">Linha do Tempo</h1>
        </div>
        <p className="text-sand-500 pl-13">
          {timelineItems.length} {timelineItems.length === 1 ? 'atividade' : 'atividades'} registradas
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-ocean via-aqua to-transparent ml-8" />

        {/* Itens */}
        <div className="space-y-6">
          {timelineItems.map((item, index) => (
            <motion.div
              key={`${item.type}-${item.id}`}
              className="relative pl-32"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Dot na timeline */}
              <div className="absolute left-0 top-2 w-6 h-6 bg-white border-4 border-ocean rounded-full ml-5 flex items-center justify-center text-lg">
                {item.type === 'event' ? (
                  eventIcons[item.eventType]?.icon || '📍'
                ) : (
                  categoryIcons[item.category] || '💰'
                )}
              </div>

              {/* Card */}
              <motion.div
                className={`rounded-xl p-5 shadow-sm border transition-all ${
                  item.type === 'event'
                    ? 'bg-ocean-50 border-ocean-200 hover:shadow-md'
                    : 'bg-orange-50 border-orange-200 hover:shadow-md'
                }`}
                whileHover={{ x: 4 }}
              >
                {/* Data */}
                <div className="text-sm font-semibold text-sand-600 mb-2">
                  {format(item.date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </div>

                {/* Conteúdo */}
                {item.type === 'event' ? (
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-1">{item.title}</h3>
                    {item.location && (
                      <p className="text-sm text-dark-50 flex items-center gap-1 mb-2">
                        <MapPin className="w-4 h-4" />
                        {item.location}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-dark-50">{item.description}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-1">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-dark-50">
                        Pago por: <strong>{participantsData[item.paidBy]?.displayName || 'Carregando...'}</strong>
                      </p>
                      <span className="text-lg font-bold text-ocean">
                        R$ {Number(item.amount).toFixed(2)}
                      </span>
                    </div>
                    {item.status === 'pendente' && (
                      <span className="text-xs font-bold text-orange-600 mt-2 inline-block">⏳ PENDENTE</span>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineViagemPage;
