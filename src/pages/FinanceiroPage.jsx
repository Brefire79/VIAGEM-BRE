import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrip } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, Plane, Car, Hotel, MapPin, UtensilsCrossed, MoreHorizontal,
  DollarSign, TrendingUp, Users, X, Edit2, Trash2, Receipt
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { pageVariants, cardVariants, buttonVariants, modalOverlayVariants, modalContentVariants } from '../utils/motionVariants';

const FinanceiroPage = () => {
  const { user } = useAuth();
  const { expenses, addExpense, updateExpense, deleteExpense, currentTrip, participants, participantsData } = useTrip();
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    category: 'aereo',
    description: '',
    amount: '',
    paidBy: user?.uid || '',
    splitBetween: [],
    date: new Date().toISOString().split('T')[0]
  });

  // Categorias de despesas
  const categories = {
    aereo: { icon: Plane, label: 'Aéreo', color: 'bg-ocean' },
    transfer: { icon: Car, label: 'Transfer', color: 'bg-aqua' },
    hospedagem: { icon: Hotel, label: 'Hospedagem', color: 'bg-purple-500' },
    passeios: { icon: MapPin, label: 'Passeios', color: 'bg-green-500' },
    alimentacao: { icon: UtensilsCrossed, label: 'Alimentação', color: 'bg-orange-500' },
    outros: { icon: MoreHorizontal, label: 'Outros', color: 'bg-gray-500' }
  };

  // Função auxiliar para pegar nome do participante
  const getParticipantName = (uid) => {
    return participantsData[uid]?.displayName || 'Carregando...';
  };

  // Função para alternar seleção de participante
  const toggleParticipant = (participantId) => {
    setFormData(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.includes(participantId)
        ? prev.splitBetween.filter(id => id !== participantId)
        : [...prev.splitBetween, participantId]
    }));
  };

  // Cálculos financeiros
  const calculations = useMemo(() => {
    // Total geral
    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Total por categoria
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});

    // Total por pessoa (quanto cada um pagou)
    const paidByPerson = expenses.reduce((acc, exp) => {
      acc[exp.paidBy] = (acc[exp.paidBy] || 0) + Number(exp.amount);
      return acc;
    }, {});

    // Quanto cada pessoa deveria pagar (divisão justa)
    const shouldPayPerPerson = expenses.reduce((acc, exp) => {
      const splitCount = exp.splitBetween.length;
      const amountPerPerson = Number(exp.amount) / splitCount;
      
      exp.splitBetween.forEach(personId => {
        acc[personId] = (acc[personId] || 0) + amountPerPerson;
      });
      
      return acc;
    }, {});

    // Balanço final (quem deve/recebe)
    const balance = {};
    const allParticipants = [...new Set([...Object.keys(paidByPerson), ...Object.keys(shouldPayPerPerson)])];
    
    allParticipants.forEach(personId => {
      const paid = paidByPerson[personId] || 0;
      const shouldPay = shouldPayPerPerson[personId] || 0;
      balance[personId] = paid - shouldPay;
    });

    return {
      total,
      byCategory,
      paidByPerson,
      shouldPayPerPerson,
      balance
    };
  }, [expenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação
    if (formData.splitBetween.length === 0) {
      alert('Selecione pelo menos uma pessoa para dividir a despesa');
      return;
    }
    
    if (!formData.date) {
      alert('Por favor, selecione uma data para a despesa');
      return;
    }

    // Cria data sem conversão de timezone
    const [year, month, day] = formData.date.split('-').map(Number);
    
    // Validação de valores numéricos
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      alert('Data inválida. Verifique os valores inseridos.');
      return;
    }
    
    const expenseData = {
      ...formData,
      amount: Number(formData.amount),
      date: new Date(year, month - 1, day, 12, 0) // 12h meio-dia para evitar problemas de timezone
    };

    let result;
    if (editingExpense) {
      result = await updateExpense(editingExpense.id, expenseData);
    } else {
      result = await addExpense(expenseData);
    }

    if (result.success) {
      handleCloseModal();
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      const expenseDate = expense.date?.toDate?.() || new Date(expense.date);
      setEditingExpense(expense);
      setFormData({
        category: expense.category,
        description: expense.description,
        amount: expense.amount.toString(),
        paidBy: expense.paidBy,
        splitBetween: expense.splitBetween,
        date: format(expenseDate, 'yyyy-MM-dd')
      });
    } else {
      setEditingExpense(null);
      setFormData({
        category: 'aereo',
        description: '',
        amount: '',
        paidBy: user?.uid || '',
        splitBetween: participants,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      await deleteExpense(expenseId);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!currentTrip) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <DollarSign className="w-16 h-16 text-sand-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Nenhuma viagem encontrada</h2>
          <p className="text-sand-500">Crie uma viagem para começar</p>
        </div>
      </div>
    );
  }

  // Cálculo da situação do usuário atual
  const userBalance = calculations.balance[user?.uid] || 0;
  const userIsPositive = userBalance > 0;
  const userIsZero = Math.abs(userBalance) < 0.01;

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-dark mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          💰 Financeiro
        </motion.h1>
        <motion.p 
          className="text-sand-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Veja quanto gastou, quanto deve e quanto tem a receber
        </motion.p>
      </div>

      {/* 1️⃣ TOPO – RESUMO ABSOLUTO */}
      <motion.div 
        className="card bg-gradient-to-br from-ocean to-ocean-700 text-white mb-6 p-6 md:p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-4 md:mb-6">
          <p className="text-xs md:text-sm opacity-80 uppercase tracking-wider mb-2">Total da Viagem</p>
          <motion.p 
            className="text-4xl md:text-5xl lg:text-6xl font-black"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            {formatCurrency(calculations.total)}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          {Object.entries(categories).map(([key, { icon: Icon, label }], index) => {
            const amount = calculations.byCategory[key] || 0;
            if (amount === 0) return null;
            const percentage = calculations.total > 0 ? (amount / calculations.total) * 100 : 0;

            return (
              <motion.div 
                key={key} 
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.05) }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium truncate">{label}</span>
                </div>
                <p className="text-base md:text-lg font-bold truncate">{formatCurrency(amount)}</p>
                <p className="text-xs opacity-75">{percentage.toFixed(0)}%</p>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center gap-6 md:gap-8 text-center pt-4 border-t border-white border-opacity-30">
          <div>
            <p className="text-xs opacity-80 mb-1">Despesas</p>
            <p className="text-xl md:text-2xl font-bold">{expenses.length}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Participantes</p>
            <p className="text-xl md:text-2xl font-bold">{participants.length}</p>
          </div>
        </div>
      </motion.div>

      {/* 2️⃣ BLOCO "SUA SITUAÇÃO" */}
      <motion.div 
        className={`card mb-6 border-4 ${
          userIsZero 
            ? 'border-green-300 bg-green-50' 
            : userIsPositive 
            ? 'border-green-400 bg-green-50' 
            : 'border-orange-400 bg-orange-50'
        }`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <div className="text-center py-4 md:py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
          >
            {userIsZero ? (
              <>
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">✅</div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-700 mb-2">
                  Tudo certo!
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-green-600 px-4">
                  Você está quitado. Ninguém deve nada para você e você não deve nada.
                </p>
              </>
            ) : userIsPositive ? (
              <>
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">💚</div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-green-700 mb-2">
                  Você tem a receber
                </h2>
                <motion.p 
                  className="text-3xl md:text-4xl lg:text-5xl font-black text-green-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: 'spring' }}
                >
                  {formatCurrency(userBalance)}
                </motion.p>
                <p className="text-xs md:text-sm text-green-600 mt-2 px-4">
                  Você pagou mais do que sua parte
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">💸</div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-orange-700 mb-2">
                  Você deve
                </h2>
                <motion.p 
                  className="text-3xl md:text-4xl lg:text-5xl font-black text-orange-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: 'spring' }}
                >
                  {formatCurrency(Math.abs(userBalance))}
                </motion.p>
                <p className="text-xs md:text-sm text-orange-600 mt-2 px-4">
                  Outros pagaram por você
                </p>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* 3️⃣ RESUMO POR PESSOA */}
      <motion.div 
        className="card mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-3">
          <Users className="w-7 h-7 text-ocean" />
          Resumo por Pessoa
        </h2>
        <div className="space-y-4">
          {Object.entries(calculations.balance)
            .sort((a, b) => b[1] - a[1]) // Ordena: quem recebe primeiro
            .map(([personId, balance], index) => {
            const paid = calculations.paidByPerson[personId] || 0;
            const shouldPay = calculations.shouldPayPerPerson[personId] || 0;
            const isPositive = balance > 0;
            const isZero = Math.abs(balance) < 0.01;
            const isCurrentUser = personId === user?.uid;

            return (
              <motion.div 
                key={personId} 
                className={`p-6 rounded-2xl border-2 ${
                  isCurrentUser 
                    ? 'bg-ocean-50 border-ocean-300' 
                    : 'bg-sand-50 border-sand-200'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (index * 0.05) }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Nome */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-dark mb-1 flex flex-wrap items-center gap-2">
                      <span className="truncate">{getParticipantName(personId)}</span>
                      {isCurrentUser && (
                        <span className="text-xs bg-ocean text-white px-2 py-1 rounded-full whitespace-nowrap">
                          Você
                        </span>
                      )}
                    </h3>
                    <p className="text-xs md:text-sm text-sand-500">
                      Pagou {formatCurrency(paid)} • Deveria pagar {formatCurrency(shouldPay)}
                    </p>
                  </div>

                  {/* Saldo */}
                  <div className="text-right md:text-center shrink-0">
                    <p className="text-xs text-sand-500 mb-1">Saldo</p>
                    <p className={`text-2xl md:text-3xl font-black ${
                      isZero 
                        ? 'text-green-600' 
                        : isPositive 
                        ? 'text-green-600' 
                        : 'text-orange-600'
                    }`}>
                      {isZero ? '✓ R$ 0' : isPositive ? `+ ${formatCurrency(balance)}` : `- ${formatCurrency(Math.abs(balance))}`}
                    </p>
                    <p className="text-xs text-sand-600 mt-1">
                      {isZero ? 'Quitado' : isPositive ? 'Tem a receber' : 'Deve pagar'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Botão adicionar despesa */}
      <motion.button
        onClick={() => handleOpenModal()}
        className="btn-primary w-full sm:w-auto mb-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5 inline mr-2" />
        Adicionar Despesa
      </motion.button>

      {/* Lista de despesas */}
      {expenses.length === 0 ? (
        <motion.div 
          className="card text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Receipt className="w-16 h-16 text-sand-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark mb-2">Nenhuma despesa ainda</h3>
          <p className="text-sand-500">Adicione a primeira despesa da viagem</p>
        </motion.div>
      ) : (
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-ocean" />
            Todas as Despesas ({expenses.length})
          </h2>
          <div className="space-y-3">
          {expenses.map((expense, index) => {
            const CategoryIcon = categories[expense.category].icon;
            const categoryColor = categories[expense.category].color;
            const expenseDate = expense.date?.toDate?.() || new Date(expense.date);

            return (
              <motion.div 
                key={expense.id} 
                className="p-4 bg-sand-50 hover:bg-sand-100 rounded-xl transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + (index * 0.05) }}
                whileHover={{ x: 4 }}
              >
                <div className="flex gap-4">
                  {/* Ícone */}
                  <div className={`${categoryColor} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`badge ${categoryColor} bg-opacity-20 text-xs`}>
                            {categories[expense.category].label}
                          </span>
                          <span className="text-xs text-sand-500">
                            {format(expenseDate, "d 'de' MMM", { locale: ptBR })}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-dark">
                          {expense.description}
                        </h3>
                      </div>
                      
                      {/* Ações */}
                      <div className="flex gap-1">
                        <motion.button
                          onClick={() => handleOpenModal(expense)}
                          className="p-2 hover:bg-ocean-50 rounded-lg transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit2 className="w-4 h-4 text-ocean" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-sand-500">
                        <span>Pago por: {getParticipantName(expense.paidBy)}</span>
                        <span className="mx-2">•</span>
                        <span>Dividido entre {expense.splitBetween.length}</span>
                      </div>
                      <p className="text-xl font-bold text-ocean">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        </motion.div>
      )}

      {/* Modal de adicionar/editar despesa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Header do modal */}
            <div className="flex items-center justify-between p-6 border-b border-sand-300">
              <h2 className="text-2xl font-bold text-dark">
                {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-sand-200 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-dark" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Categoria *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(categories).map(([key, { icon: Icon, label, color }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: key })}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        formData.category === key
                          ? `${color} border-transparent text-white`
                          : 'border-sand-300 hover:border-sand-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Descrição *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  placeholder="Ex: Passagem aérea São Paulo"
                  required
                />
              </div>

              {/* Valor e Data */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input"
                    placeholder="0.00"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              {/* Quem pagou */}
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Quem pagou? *
                </label>
                <select
                  value={formData.paidBy}
                  onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                  className="input"
                  required
                >
                  {participants.map(participantId => (
                    <option key={participantId} value={participantId}>
                      {getParticipantName(participantId)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dividir entre */}
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Dividir entre *
                </label>
                <div className="space-y-2">
                  {participants.map(participantId => (
                    <label
                      key={participantId}
                      className="flex items-center gap-3 p-3 bg-sand-100 rounded-xl cursor-pointer hover:bg-sand-200 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.splitBetween.includes(participantId)}
                        onChange={() => toggleParticipant(participantId)}
                        className="w-5 h-5 text-ocean rounded focus:ring-ocean"
                      />
                      <span className="font-medium text-dark">
                        {getParticipantName(participantId)}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.splitBetween.length > 0 && formData.amount && (
                  <p className="text-sm text-sand-500 mt-2">
                    Cada pessoa pagará: {formatCurrency(Number(formData.amount) / formData.splitBetween.length)}
                  </p>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingExpense ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FinanceiroPage;

