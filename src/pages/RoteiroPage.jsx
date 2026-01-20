import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrip } from '../contexts/TripContext';
import { Plus, Plane, Car, Hotel, MapPin, UtensilsCrossed, X, Edit2, Trash2, Calendar as CalendarIcon, Clock, MapPinIcon, Check, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { pageVariants, cardVariants, buttonVariants, modalOverlayVariants, modalContentVariants, successVariants } from '../utils/motionVariants';

const RoteiroPage = () => {
  const { events, addEvent, updateEvent, deleteEvent, currentTrip } = useTrip();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    type: 'voo',
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });

  // Ícones e labels por tipo de evento
  const eventTypes = {
    voo: { icon: Plane, label: 'Voo', color: 'bg-ocean' },
    transfer: { icon: Car, label: 'Transfer', color: 'bg-aqua' },
    hospedagem: { icon: Hotel, label: 'Hospedagem', color: 'bg-purple-500' },
    passeio: { icon: MapPin, label: 'Passeio', color: 'bg-green-500' },
    alimentacao: { icon: UtensilsCrossed, label: 'Alimentação', color: 'bg-orange-500' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validação de data
    if (!formData.date) {
      alert('Por favor, selecione uma data para o evento');
      setLoading(false);
      return;
    }
    
    // Criar data local sem conversão de timezone
    const [year, month, day] = formData.date.split('-').map(Number);
    const [hours, minutes] = (formData.time || '00:00').split(':').map(Number);
    
    // Validação de valores numéricos
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
      alert('Data ou horário inválido. Verifique os valores inseridos.');
      setLoading(false);
      return;
    }
    
    const eventData = {
      ...formData,
      date: new Date(year, month - 1, day, hours, minutes)
    };

    let result;
    if (editingEvent) {
      result = await updateEvent(editingEvent.id, eventData);
    } else {
      result = await addEvent(eventData);
    }

    setLoading(false);
    
    if (result.success) {
      setSuccessMessage(editingEvent ? 'Evento atualizado!' : 'Evento adicionado!');
      setTimeout(() => setSuccessMessage(''), 3000);
      handleCloseModal();
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      const eventDate = event.date?.toDate?.() || new Date(event.date);
      setEditingEvent(event);
      setFormData({
        type: event.type,
        title: event.title,
        description: event.description || '',
        date: format(eventDate, 'yyyy-MM-dd'),
        time: format(eventDate, 'HH:mm'),
        location: event.location || ''
      });
    } else {
      setEditingEvent(null);
      setFormData({
        type: 'voo',
        title: '',
        description: '',
        date: '',
        time: '',
        location: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      await deleteEvent(eventId);
    }
  };

  // Agrupa eventos por data
  const groupEventsByDate = () => {
    const grouped = {};
    events.forEach(event => {
      const eventDate = event.date?.toDate?.() || new Date(event.date);
      const dateKey = format(eventDate, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push({ ...event, parsedDate: eventDate });
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();
  const sortedDates = Object.keys(groupedEvents).sort();

  if (!currentTrip) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="empty-state animate-fade-in">
          <div className="w-20 h-20 bg-ocean-50 rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
            <Plane className="w-10 h-10 text-ocean" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-3">Nenhuma viagem encontrada</h2>
          <p className="text-sand-500 mb-8 max-w-md">
            Crie sua primeira viagem para começar a planejar momentos inesquecíveis
          </p>
          <button className="btn-primary">
            <Plus className="w-5 h-5 inline mr-2" />
            Criar primeira viagem
          </button>
        </div>
      </div>
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
      {/* Header com gradiente sutil */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-ocean to-aqua rounded-xl flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <CalendarIcon className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-dark">Roteiro da Viagem</h1>
        </div>
        <motion.p 
          className="text-sand-500 pl-13"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {events.length} {events.length === 1 ? 'evento planejado' : 'eventos planejados'}
        </motion.p>
      </div>

      {/* Mensagem de sucesso */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            className="success-message mb-6"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão adicionar com animação */}
      <motion.button
        onClick={() => handleOpenModal()}
        className="btn-primary w-full sm:w-auto mb-8 shadow-lg hover:shadow-xl"
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <Plus className="w-5 h-5 inline mr-2" />
        Adicionar Evento
      </motion.button>

      {/* Lista de eventos */}
      {sortedDates.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="w-20 h-20 bg-ocean-50 rounded-full flex items-center justify-center mb-6">
            <CalendarIcon className="w-10 h-10 text-ocean animate-pulse-soft" />
          </div>
          <h3 className="text-2xl font-bold text-dark mb-3">Comece sua jornada</h3>
          <p className="text-sand-500 mb-8 max-w-md">
            Adicione o primeiro evento e comece a planejar cada detalhe da sua viagem
          </p>
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Adicionar primeiro evento
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((dateKey, dateIndex) => (
            <motion.div 
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dateIndex * 0.1, duration: 0.3 }}
            >
              {/* Header da data com estilo timeline */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-3 bg-gradient-to-r from-ocean-50 to-transparent pr-8 py-2 rounded-l-full">
                  <motion.div 
                    className="w-10 h-10 bg-ocean rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: dateIndex * 0.1 + 0.1, type: 'spring', stiffness: 200 }}
                  >
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold text-dark">
                      {format(new Date(dateKey), "d 'de' MMMM", { locale: ptBR })}
                    </h2>
                    <p className="text-xs text-sand-500">
                      {format(new Date(dateKey), "EEEE", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-sand-300 to-transparent"></div>
                <span className="text-xs font-medium text-sand-400 bg-sand-100 px-3 py-1 rounded-full">
                  {groupedEvents[dateKey].length} {groupedEvents[dateKey].length === 1 ? 'evento' : 'eventos'}
                </span>
              </div>

              {/* Eventos do dia com linha de conexão */}
              <div className="relative pl-6 space-y-4">
                {/* Linha vertical timeline */}
                <motion.div 
                  className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ocean-200 via-aqua-200 to-transparent"
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: dateIndex * 0.1 + 0.2, duration: 0.4 }}
                ></motion.div>
                
                {groupedEvents[dateKey].map((event, eventIndex) => {
                  const EventIcon = eventTypes[event.type].icon;
                  const eventColor = eventTypes[event.type].color;

                  return (
                    <motion.div 
                      key={event.id} 
                      className="relative"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={dateIndex * 3 + eventIndex}
                    >
                      {/* Dot na timeline */}
                      <motion.div 
                        className={`absolute -left-[26px] top-6 w-3 h-3 ${eventColor} rounded-full border-4 border-sand shadow-sm z-10`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (dateIndex * 3 + eventIndex) * 0.04 + 0.15, type: 'spring' }}
                      ></motion.div>
                      
                      <motion.div 
                        className="card-interactive group"
                        whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                      >
                        <div className="flex gap-4">
                          {/* Ícone animado */}
                          <motion.div 
                            className={`${eventColor} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <EventIcon className="w-7 h-7 text-white" />
                          </motion.div>

                          {/* Conteúdo com melhor hierarquia */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`badge ${eventColor} bg-opacity-20 text-xs font-semibold`}>
                                    {eventTypes[event.type].label}
                                  </span>
                                  <span className="text-xs text-sand-400">•</span>
                                  <span className="text-xs text-sand-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(event.parsedDate, 'HH:mm')}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-dark mb-1 group-hover:text-ocean transition-colors">
                                  {event.title}
                                </h3>
                                {event.location && (
                                  <p className="text-sm text-sand-500 flex items-center gap-1 mb-2">
                                    <MapPinIcon className="w-3.5 h-3.5" />
                                    {event.location}
                                  </p>
                                )}
                              </div>
                              
                              {/* Ações com melhor feedback */}
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <motion.button
                                  onClick={() => handleOpenModal(event)}
                                  className="p-2.5 hover:bg-ocean-50 rounded-xl transition-all"
                                  title="Editar evento"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Edit2 className="w-4 h-4 text-ocean" />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="p-2.5 hover:bg-red-50 rounded-xl transition-all"
                                  title="Excluir evento"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </motion.button>
                              </div>
                            </div>

                            {event.description && (
                              <motion.p 
                                className="text-sm text-dark-50 leading-relaxed bg-sand-50 px-3 py-2 rounded-lg"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ delay: 0.1 }}
                              >
                                {event.description}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de adicionar/editar evento */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Overlay com blur */}
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              variants={modalOverlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleCloseModal}
            >
              <motion.div 
                className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header do modal */}
                <div className="flex items-center justify-between p-6 border-b border-sand-300">
                  <h2 className="text-2xl font-bold text-dark">
                    {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                  </h2>
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-sand-200 rounded-lg transition-all"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-dark" />
                  </motion.button>
                </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Tipo de Evento
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(eventTypes).map(([key, { icon: Icon, label, color }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: key })}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        formData.type === key
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

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Ex: Voo para São Paulo"
                  required
                />
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              {/* Local */}
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Local
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input"
                  placeholder="Ex: Aeroporto de Guarulhos"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[100px] resize-none"
                  placeholder="Adicione detalhes sobre este evento..."
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-outline flex-1"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Cancelar
                </motion.button>
                <motion.button 
                  type="submit" 
                  className="btn-primary flex-1 relative"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Salvando...
                    </motion.span>
                  ) : (
                    editingEvent ? 'Salvar' : 'Adicionar'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoteiroPage;
