import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrip } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import { Download, Share2, Heart, Flame, Award, TrendingUp, Users, DollarSign, MapPin } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RetrospectivePage = () => {
  const { currentTrip, events, expenses, participants, participantsData } = useTrip();
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);

  // Cálculos para retrospectiva
  const retrospectiveData = useMemo(() => {
    if (!currentTrip || !events.length) return null;

    const startDate = new Date(currentTrip.startDate);
    const endDate = new Date(currentTrip.endDate);
    const tripDays = differenceInDays(endDate, startDate) + 1;

    // Totais
    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const totalEvents = events.length;

    // Tipo de evento mais frequente
    const eventCounts = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});
    const mostCommonEvent = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0];

    // Gasto por pessoa
    const spendByPerson = expenses.reduce((acc, exp) => {
      acc[exp.paidBy] = (acc[exp.paidBy] || 0) + Number(exp.amount);
      return acc;
    }, {});
    const topSpender = Object.entries(spendByPerson).sort((a, b) => b[1] - a[1])[0];

    // Gastos por categoria
    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});
    const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];

    // Gasto médio por dia
    const avgDailySpend = (totalExpenses / tripDays).toFixed(2);

    // Participantes
    const topContributor = Object.entries(spendByPerson).sort((a, b) => b[1] - a[1])[0];

    const categoryLabels = {
      aereo: { label: 'Aéreo', icon: '✈️' },
      transfer: { label: 'Transfer', icon: '🚗' },
      hospedagem: { label: 'Hospedagem', icon: '🏨' },
      passeios: { label: 'Passeios', icon: '🎯' },
      alimentacao: { label: 'Alimentação', icon: '🍽️' },
      outros: { label: 'Outros', icon: '💰' }
    };

    const eventLabels = {
      voo: { label: 'Voos', icon: '✈️' },
      transfer: { label: 'Transfers', icon: '🚗' },
      hospedagem: { label: 'Hospedagem', icon: '🏨' },
      passeio: { label: 'Passeios', icon: '🎯' },
      alimentacao: { label: 'Refeições', icon: '🍽️' }
    };

    return {
      tripDays,
      totalExpenses,
      totalEvents,
      avgDailySpend,
      mostCommonEvent: mostCommonEvent ? { type: mostCommonEvent[0], count: mostCommonEvent[1], label: eventLabels[mostCommonEvent[0]]?.label } : null,
      topSpender: topSpender ? { uid: topSpender[0], amount: topSpender[1] } : null,
      topCategory: topCategory ? { category: topCategory[0], amount: topCategory[1], label: categoryLabels[topCategory[0]]?.label, icon: categoryLabels[topCategory[0]]?.icon } : null,
      participantCount: participants.length,
      categoryLabels,
      eventLabels,
      expensesByCategory
    };
  }, [currentTrip, events, expenses, participants]);

  if (!retrospectiveData) {
    return (
      <div className="max-w-4xl mx-auto pb-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Award className="w-16 h-16 text-sand-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Crie sua Retrospectiva</h2>
          <p className="text-sand-500">Adicione eventos e despesas para ver seus destaques da viagem.</p>
        </div>
      </div>
    );
  }

  const handleCopyText = () => {
    const text = `🎉 Minha Retrospectiva de Viagem ${new Date().getFullYear()}

📍 ${currentTrip.name || 'Nossa Viagem'}
📅 ${retrospectiveData.tripDays} dias de aventura
👥 ${retrospectiveData.participantCount} viajantes

💰 Total gasto: R$ ${retrospectiveData.totalExpenses.toFixed(2)}
📊 Gasto médio/dia: R$ ${retrospectiveData.avgDailySpend}
🎯 ${retrospectiveData.totalEvents} eventos planejados

Maior gasto: ${retrospectiveData.topCategory?.label} (R$ ${retrospectiveData.topCategory?.amount.toFixed(2)})
Atividade principal: ${retrospectiveData.mostCommonEvent?.label} (${retrospectiveData.mostCommonEvent?.count}x)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-ocean-900 to-dark pb-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-ocean-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-aqua-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10">
          {/* Intro */}
          <motion.div
            className="text-center pt-20 pb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6"
            >
              <span className="text-6xl">🎉</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
              Sua Retrospectiva
            </h1>
            <p className="text-aqua-200 text-lg">
              {currentTrip.name || 'Nossa Viagem'} • {retrospectiveData.tripDays} dias de aventura
            </p>
          </motion.div>

          {/* Cards principais */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, staggerChildren: 0.1 }}
          >
            {/* Total de dias */}
            <motion.div
              className="bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-2xl p-6 text-white text-center shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl md:text-5xl font-black mb-2">
                {retrospectiveData.tripDays}
              </div>
              <div className="text-sm font-semibold opacity-90">Dias Viajando</div>
            </motion.div>

            {/* Participantes */}
            <motion.div
              className="bg-gradient-to-br from-aqua-500 to-aqua-600 rounded-2xl p-6 text-white text-center shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-black mb-2">
                {retrospectiveData.participantCount}
              </div>
              <div className="text-sm font-semibold opacity-90">Viajantes</div>
            </motion.div>

            {/* Total gasto */}
            <motion.div
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl md:text-4xl font-black mb-2">
                R$ {retrospectiveData.totalExpenses.toFixed(2)}
              </div>
              <div className="text-sm font-semibold opacity-90">Total Gasto</div>
            </motion.div>

            {/* Eventos */}
            <motion.div
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl md:text-5xl font-black mb-2">
                {retrospectiveData.totalEvents}
              </div>
              <div className="text-sm font-semibold opacity-90">Eventos</div>
            </motion.div>
          </motion.div>

          {/* Insights */}
          <motion.div
            className="space-y-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Gasto médio por dia */}
            <motion.div
              className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-2xl">💰</div>
                <div>
                  <p className="text-white/70 text-sm">Gasto Médio por Dia</p>
                  <p className="text-white text-2xl font-bold">R$ {retrospectiveData.avgDailySpend}</p>
                </div>
              </div>
            </motion.div>

            {/* Maior gasto */}
            {retrospectiveData.topCategory && (
              <motion.div
                className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center text-2xl">
                    {retrospectiveData.topCategory.icon}
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Maior Gasto</p>
                    <p className="text-white text-2xl font-bold">
                      {retrospectiveData.topCategory.label} • R$ {retrospectiveData.topCategory.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Atividade principal */}
            {retrospectiveData.mostCommonEvent && (
              <motion.div
                className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
                    {retrospectiveData.eventLabels[retrospectiveData.mostCommonEvent.type]?.icon}
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Atividade Principal</p>
                    <p className="text-white text-2xl font-bold">
                      {retrospectiveData.mostCommonEvent.label} • {retrospectiveData.mostCommonEvent.count}x
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Botões de ação */}
          <motion.div
            className="flex gap-3 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={handleCopyText}
              className="flex-1 bg-white text-dark font-bold py-3 px-6 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{copied ? '✓' : '📋'}</span>
              {copied ? 'Copiado!' : 'Copiar Resumo'}
            </motion.button>
            <motion.button
              className="flex-1 bg-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition-all flex items-center justify-center gap-2 border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </motion.button>
          </motion.div>

          {/* Mensagem final */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-white/60 text-sm">
              ✨ Obrigado por compartilhar essa jornada incrível! ✨
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RetrospectivePage;
