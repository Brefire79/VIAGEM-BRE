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
  const { expenses, addExpense, updateExpense, deleteExpense, currentTrip, participants } = useTrip();
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

    const expenseData = {
      ...formData,
      amount: Number(formData.amount),
      date: new Date(formData.date)
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

  const toggleParticipant = (participantId) => {
    setFormData(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.includes(participantId)
        ? prev.splitBetween.filter(id => id !== participantId)
        : [...prev.splitBetween, participantId]
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getParticipantName = (userId) => {
    // Em produção, você buscaria o nome real do usuário
    if (userId === user?.uid) return 'Você';
    return `Usuário ${userId.slice(0, 6)}`;
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
          Controle Financeiro
        </motion.h1>
        <motion.p 
          className="text-sand-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Gerencie todas as despesas da viagem de forma transparente
        </motion.p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total da viagem */}
        <motion.div 
          className="card bg-gradient-to-br from-ocean to-ocean-600 text-white"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
              className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <DollarSign className="w-6 h-6" />
            </motion.div>
            <span className="text-sm opacity-90">Total da Viagem</span>
          </div>
          <motion.p 
            className="text-3xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {formatCurrency(calculations.total)}
          </motion.p>
        </motion.div>

        {/* Total de despesas */}
        <motion.div 
          className="card bg-gradient-to-br from-aqua to-aqua-600 text-white"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
              className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Receipt className="w-6 h-6" />
            </motion.div>
            <span className="text-sm opacity-90">Despesas</span>
          </div>
          <motion.p 
            className="text-3xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, type: 'spring' }}
          >
            {expenses.length}
          </motion.p>
        </motion.div>

        {/* Participantes */}
        <motion.div 
          className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
              className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Users className="w-6 h-6" />
            </motion.div>
            <span className="text-sm opacity-90">Participantes</span>
          </div>
          <motion.p 
            className="text-3xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            {participants.length}
          </motion.p>
        </motion.div>
      </div>

      {/* Total por categoria */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-ocean" />
          Gastos por Categoria
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(categories).map(([key, { icon: Icon, label, color }]) => {
            const amount = calculations.byCategory[key] || 0;
            const percentage = calculations.total > 0 ? (amount / calculations.total) * 100 : 0;

            return (
              <div key={key} className="p-4 bg-sand-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${color} w-8 h-8 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-dark-100">{label}</span>
                </div>
                <p className="text-lg font-bold text-dark">{formatCurrency(amount)}</p>
                <p className="text-xs text-sand-500">{percentage.toFixed(1)}% do total</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Balanço por pessoa */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-ocean" />
          Balanço por Pessoa
        </h2>
        <div className="space-y-3">
          {Object.entries(calculations.balance).map(([personId, balance]) => {
            const paid = calculations.paidByPerson[personId] || 0;
            const shouldPay = calculations.shouldPayPerPerson[personId] || 0;
            const isPositive = balance > 0;
            const isZero = Math.abs(balance) < 0.01;

            return (
              <div key={personId} className="p-4 bg-sand-100 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-dark">{getParticipantName(personId)}</span>
                  <span className={`text-lg font-bold ${
                    isZero ? 'text-sand-500' : isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isZero ? 'Quitado' : isPositive ? `+${formatCurrency(balance)}` : formatCurrency(balance)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-sand-500">
                  <span>Pagou: {formatCurrency(paid)}</span>
                  <span>Deve pagar: {formatCurrency(shouldPay)}</span>
                </div>
                {!isZero && (
                  <p className="text-xs mt-2 text-dark-50">
                    {isPositive 
                      ? '✅ Receberá dos demais participantes'
                      : '⚠️ Precisa acertar com quem pagou mais'
                    }
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão adicionar despesa */}
      <button
        onClick={() => handleOpenModal()}
        className="btn-primary w-full sm:w-auto mb-6"
      >
        <Plus className="w-5 h-5 inline mr-2" />
        Adicionar Despesa
      </button>

      {/* Lista de despesas */}
      {expenses.length === 0 ? (
        <div className="card text-center py-12">
          <Receipt className="w-16 h-16 text-sand-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark mb-2">Nenhuma despesa ainda</h3>
          <p className="text-sand-500">Adicione a primeira despesa da viagem</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map(expense => {
            const CategoryIcon = categories[expense.category].icon;
            const categoryColor = categories[expense.category].color;
            const expenseDate = expense.date?.toDate?.() || new Date(expense.date);

            return (
              <div key={expense.id} className="card hover:shadow-lg transition-all animate-fade-in">
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
                        <button
                          onClick={() => handleOpenModal(expense)}
                          className="p-2 hover:bg-sand-200 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4 text-ocean" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
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
              </div>
            );
          })}
        </div>
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

