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
    date: new Date().toISOString().split('T')[0],
    status: 'pago' // 'pago' ou 'pendente'
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

  // Cálculos financeiros
  const calculations = useMemo(() => {
    // Filtrar despesas: se não tem status, considera como pago (compatibilidade com dados antigos)
    const paidExpenses = expenses.filter(exp => !exp.status || exp.status === 'pago');
    const pendingExpenses = expenses.filter(exp => exp.status === 'pendente');
    
    // Total geral (despesas pagas)
    const total = paidExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const totalPending = pendingExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Total por categoria (despesas pagas)
    const byCategory = paidExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});

    // Total por pessoa (quanto cada um pagou - despesas pagas)
    const paidByPerson = paidExpenses.reduce((acc, exp) => {
      acc[exp.paidBy] = (acc[exp.paidBy] || 0) + Number(exp.amount);
      return acc;
    }, {});

    // Quanto cada pessoa deveria pagar (divisão justa - despesas pagas)
    const shouldPayPerPerson = paidExpenses.reduce((acc, exp) => {
      const splitBetween = Array.isArray(exp.splitBetween) && exp.splitBetween.length > 0
        ? exp.splitBetween
        : [exp.paidBy];

      const splitCount = splitBetween.length;
      if (!splitCount) return acc;

      const amountPerPerson = Number(exp.amount) / splitCount;
      splitBetween.forEach(personId => {
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

    console.log('[DEBUG] Cálculo de despesas:', {
      despesasPagas: paidExpenses.length,
      total,
      paidByPerson,
      shouldPayPerPerson,
      balance
    });

    return {
      total,
      totalPending,
      byCategory,
      paidByPerson,
      shouldPayPerPerson,
      balance
    };
  }, [expenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação
    if (!formData.date) {
      alert('Por favor, selecione uma data para a despesa');
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert('Digite um valor válido para a despesa');
      return;
    }

    if (!formData.paidBy) {
      alert('Por favor, selecione quem pagou');
      return;
    }

    // Cria data em UTC para evitar problemas de timezone
    const [year, month, day] = formData.date.split('-').map(Number);
    
    // Validação de valores numéricos
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      alert('Data inválida. Verifique os valores inseridos.');
      return;
    }
    
    // Criar Date em UTC (meio-dia) para evitar problemas de fuso horário
    const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0));
    
    console.log('[DEBUG] Salvando despesa:', {
      descricao: formData.description,
      valor: Number(formData.amount),
      ano: year,
      mes: month,
      dia: day,
      dateUTC: utcDate.toISOString(),
      status: formData.status,
      pagoPor: formData.paidBy
    });
    
    const expenseData = {
      ...formData,
      amount: Number(formData.amount),
      date: utcDate,
      status: formData.status || 'pago',
      // Valor atrelado apenas à pessoa que pagou
      splitBetween: [formData.paidBy]
    };

    let result;
    if (editingExpense) {
      result = await updateExpense(editingExpense.id, expenseData);
    } else {
      result = await addExpense(expenseData);
    }

    if (result.success) {
      handleCloseModal();
    } else {
      alert('Erro ao salvar despesa: ' + (result.error || 'Erro desconhecido'));
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      // Converte data usando UTC
      let expenseDate;
      if (expense.date?.toDate) {
        expenseDate = expense.date.toDate();
      } else if (expense.date instanceof Date) {
        expenseDate = expense.date;
      } else {
        expenseDate = new Date(expense.date);
      }
      
      // Extrair componentes em UTC
      const year = expenseDate.getUTCFullYear();
      const month = expenseDate.getUTCMonth() + 1;
      const day = expenseDate.getUTCDate();
      
      setEditingExpense(expense);
      setFormData({
        category: expense.category,
        description: expense.description,
        amount: expense.amount.toString(),
        paidBy: expense.paidBy,
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        status: expense.status || 'pago'
      });
    } else {
      setEditingExpense(null);
      setFormData({
        category: 'aereo',
        description: '',
        amount: '',
        paidBy: user?.uid || '',
        date: new Date().toISOString().split('T')[0],
        status: 'pago'
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
            <p className="text-xs opacity-80 mb-1">Despesas Pagas</p>
            <p className="text-xl md:text-2xl font-bold">{expenses.filter(e => !e.status || e.status === 'pago').length}</p>
          </div>
          {calculations.totalPending > 0 && (
            <div>
              <p className="text-xs opacity-80 mb-1">Pendentes</p>
              <p className="text-xl md:text-2xl font-bold text-orange-200">{expenses.filter(e => e.status === 'pendente').length}</p>
            </div>
          )}
          <div>
            <p className="text-xs opacity-80 mb-1">Participantes</p>
            <p className="text-xl md:text-2xl font-bold">{participants.length}</p>
          </div>
        </div>
        
        {/* Aviso de despesas pendentes */}
        {calculations.totalPending > 0 && (
          <motion.div
            className="mt-4 bg-orange-500 bg-opacity-90 backdrop-blur-sm rounded-lg p-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm font-semibold">
              ⚠️ {formatCurrency(calculations.totalPending)} em despesas pendentes
            </p>
          </motion.div>
        )}
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
          {expenses
            .sort((a, b) => {
              // Converter datas para comparação
              const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
              const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
              return dateA - dateB; // Ordem crescente (mais antiga primeiro)
            })
            .map((expense, index) => {
            const CategoryIcon = categories[expense.category].icon;
            const categoryColor = categories[expense.category].color;
            let expenseDate;
            if (expense.date?.toDate) {
              expenseDate = expense.date.toDate();
            } else if (expense.date instanceof Date) {
              expenseDate = expense.date;
            } else {
              expenseDate = new Date(expense.date);
            }
            
            // Extrair data em UTC para exibição correta
            const day = expenseDate.getUTCDate();
            const month = expenseDate.getUTCMonth();
            const year = expenseDate.getUTCFullYear();
            const displayDate = new Date(year, month, day);
            
            // Considera despesas sem status como pagas (compatibilidade)
            const isPendente = expense.status === 'pendente';
            const isPago = expense.status === 'pago';

            return (
              <motion.div 
                key={expense.id} 
                className={`p-4 rounded-xl transition-all relative ${
                  isPendente
                    ? 'bg-orange-50 hover:bg-orange-100 border-2 border-orange-200'
                    : 'bg-sand-50 hover:bg-sand-100'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + (index * 0.05) }}
                whileHover={{ x: 4 }}
              >
                {/* Badge de status pendente */}
                {isPendente && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span>⏳</span>
                    PENDENTE
                  </div>
                )}
                
                <div className="flex gap-4">
                  {/* Ícone */}
                  <div className={`${categoryColor} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isPendente && 'opacity-60'}`}>
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`badge ${categoryColor} bg-opacity-20 text-xs`}>
                            {categories[expense.category].label}
                          </span>
                          <span className="text-xs text-sand-500">
                            {format(displayDate, "d 'de' MMM", { locale: ptBR })}
                          </span>
                          {isPago && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                              ✓ Pago
                            </span>
                          )}
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Só fecha se clicar no overlay, não no modal
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
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
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto">
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

              {/* Status do pagamento */}
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Situação *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                    formData.status === 'pago' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-sand-200 bg-sand-50 text-sand-600 hover:border-sand-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="pago"
                      checked={formData.status === 'pago'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-xl">✅</span>
                    <span className="font-semibold">Pago</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                    formData.status === 'pendente' 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
                      : 'border-sand-200 bg-sand-50 text-sand-600 hover:border-sand-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="pendente"
                      checked={formData.status === 'pendente'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-xl">⏳</span>
                    <span className="font-semibold">Pendente</span>
                  </label>
                </div>
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

