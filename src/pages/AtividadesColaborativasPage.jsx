import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrip } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Heart, MessageCircle, Zap } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { pageVariants } from '../utils/motionVariants';

const AtividadesColaborativasPage = () => {
  const { currentTrip, events, expenses, participants, participantsData } = useTrip();
  const { user } = useAuth();
  const [likes, setLikes] = useState({});

  // Combina atividades recentes
  const recentActivities = useMemo(() => {
    if (!currentTrip) return [];

    const activities = [];

    // Últimos eventos
    events.forEach(event => {
      const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
      activities.push({
        type: 'event',
        id: event.id,
        timestamp: eventDate,
        title: event.title,
        description: event.description,
        location: event.location,
        eventType: event.type,
        icon: '📍'
      });
    });

    // Últimas despesas
    expenses.forEach(expense => {
      const expenseDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date);
      activities.push({
        type: 'expense',
        id: expense.id,
        timestamp: expenseDate,
        title: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy,
        category: expense.category,
        icon: '💰'
      });
    });

    // Ordenar por data decrescente (mais recentes primeiro)
    activities.sort((a, b) => b.timestamp - a.timestamp);

    return activities.slice(0, 20); // Últimas 20 atividades
  }, [events, expenses, currentTrip]);

  const toggleLike = (activityId) => {
    setLikes(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const getParticipantName = (uid) => {
    return participantsData[uid]?.displayName || 'Participante';
  };

  const isMyActivity = (activity) => {
    return activity.type === 'expense' && activity.paidBy === user?.uid;
  };

  if (!currentTrip || recentActivities.length === 0) {
    return (
      <motion.div
        className="max-w-4xl mx-auto pb-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="empty-state">
          <Zap className="w-16 h-16 text-sand-300 mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Nenhuma Atividade Ainda</h2>
          <p className="text-sand-500">As atividades dos participantes aparecerão aqui em tempo real.</p>
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
            <Activity className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-dark">Atividades da Viagem</h1>
        </div>
        <p className="text-sand-500 pl-13">
          Veja o que seus companheiros de viagem estão fazendo em tempo real
        </p>
      </div>

      {/* Feed de atividades */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={`${activity.type}-${activity.id}`}
              className={`rounded-xl p-5 border-l-4 transition-all ${
                activity.type === 'event'
                  ? 'bg-gradient-to-r from-ocean-50 to-transparent border-l-ocean'
                  : 'bg-gradient-to-r from-orange-50 to-transparent border-l-orange-500'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar/Ícone */}
                <div className="w-12 h-12 bg-gradient-to-br from-ocean to-aqua rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {activity.icon}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  {activity.type === 'event' ? (
                    <div>
                      <h3 className="font-bold text-dark">{activity.title}</h3>
                      {activity.location && (
                        <p className="text-sm text-dark-50 mt-1">📍 {activity.location}</p>
                      )}
                      {activity.description && (
                        <p className="text-sm text-dark-50 mt-1">{activity.description}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-dark">{activity.title}</h3>
                      <p className="text-sm text-dark-50 mt-1">
                        💰 <strong>R$ {Number(activity.amount).toFixed(2)}</strong> • Pago por{' '}
                        <strong>{getParticipantName(activity.paidBy)}</strong>
                      </p>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-sand-400 mt-2">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    onClick={() => toggleLike(activity.id)}
                    className={`p-2 rounded-lg transition-all ${
                      likes[activity.id]
                        ? 'bg-red-100 text-red-500'
                        : 'hover:bg-sand-100 text-sand-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="w-5 h-5" fill={likes[activity.id] ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Estatísticas colaborativas */}
      <motion.div
        className="mt-12 p-6 bg-gradient-to-r from-ocean-50 to-aqua-50 rounded-xl border border-ocean-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-ocean" />
          Colaboração em Tempo Real
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-black text-ocean">{participants.length}</p>
            <p className="text-xs text-dark-50">Viajantes conectados</p>
          </div>
          <div>
            <p className="text-2xl font-black text-ocean">{recentActivities.length}</p>
            <p className="text-xs text-dark-50">Atividades registradas</p>
          </div>
        </div>
        <p className="text-sm text-dark-50 mt-4 leading-relaxed">
          Todos os participantes podem ver as atividades em tempo real enquanto acontecem. Use os❤️ para reagir às ações dos seus companheiros!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AtividadesColaborativasPage;
