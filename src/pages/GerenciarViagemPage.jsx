import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTrip } from '../contexts/TripContext';
import { Users, Mail, Trash2, Edit2, Check, X } from 'lucide-react';

const GerenciarViagemPage = () => {
  const { user } = useAuth();
  const { currentTrip, participantsData, updateTrip, addParticipant, removeParticipant } = useTrip();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(currentTrip?.name || '');
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [editedDestination, setEditedDestination] = useState(currentTrip?.destination || '');
  
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [participantEmail, setParticipantEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!currentTrip) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhuma viagem selecionada</p>
        </div>
      </div>
    );
  }

  const handleSaveName = async () => {
    if (!editedName.trim()) return;
    
    setLoading(true);
    try {
      await updateTrip(currentTrip.id, { name: editedName });
      setIsEditingName(false);
      setSuccess('Nome atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar nome');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDestination = async () => {
    if (!editedDestination.trim()) return;
    
    setLoading(true);
    try {
      await updateTrip(currentTrip.id, { destination: editedDestination });
      setIsEditingDestination(false);
      setSuccess('Destino atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar destino');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!participantEmail.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      await addParticipant(currentTrip.id, participantEmail);
      setParticipantEmail('');
      setShowAddParticipant(false);
      setSuccess('Participante adicionado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao adicionar participante');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (participantId === currentTrip.createdBy) {
      setError('Não é possível remover o criador da viagem');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!window.confirm('Tem certeza que deseja remover este participante?')) {
      return;
    }

    setLoading(true);
    try {
      await removeParticipant(currentTrip.id, participantId);
      setSuccess('Participante removido com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao remover participante');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mensagens de feedback */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400"
        >
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Detalhes da Viagem */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Detalhes da Viagem</h2>

        {/* Nome da Viagem */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nome da Viagem
          </label>
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                disabled={loading}
              />
              <button
                onClick={handleSaveName}
                disabled={loading || !editedName.trim()}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setEditedName(currentTrip.name);
                }}
                disabled={loading}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-2 bg-gray-700 rounded-lg">
              <span className="text-white">{currentTrip.name}</span>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-2 text-purple-400 hover:text-purple-300"
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Destino */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Destino
          </label>
          {isEditingDestination ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedDestination}
                onChange={(e) => setEditedDestination(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                disabled={loading}
              />
              <button
                onClick={handleSaveDestination}
                disabled={loading || !editedDestination.trim()}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => {
                  setIsEditingDestination(false);
                  setEditedDestination(currentTrip.destination);
                }}
                disabled={loading}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-2 bg-gray-700 rounded-lg">
              <span className="text-white">{currentTrip.destination || 'Não especificado'}</span>
              <button
                onClick={() => setIsEditingDestination(true)}
                className="p-2 text-purple-400 hover:text-purple-300"
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Participantes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-purple-400" />
            Participantes ({currentTrip.participants?.length || 0})
          </h2>
          <button
            onClick={() => setShowAddParticipant(!showAddParticipant)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Mail size={18} />
            Adicionar por E-mail
          </button>
        </div>

        {/* Formulário para adicionar participante */}
        {showAddParticipant && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddParticipant}
            className="mb-6 p-4 bg-gray-700 rounded-lg"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-mail do Participante
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={participantEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
                placeholder="usuario@email.com"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                disabled={loading}
                required
              />
              <button
                type="submit"
                disabled={loading || !participantEmail.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Lista de Participantes */}
        <div className="space-y-3">
          {currentTrip.participants?.map((participantId) => {
            const participant = participantsData[participantId];
            const isCreator = participantId === currentTrip.createdBy;

            return (
              <motion.div
                key={participantId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {participant?.displayName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {participant?.displayName || participantId.substring(0, 8)}
                      {isCreator && (
                        <span className="ml-2 text-xs px-2 py-1 bg-purple-600 rounded-full">
                          Criador
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {participant?.email || 'E-mail não disponível'}
                    </p>
                  </div>
                </div>

                {!isCreator && (
                  <button
                    onClick={() => handleRemoveParticipant(participantId)}
                    disabled={loading}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remover participante"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {currentTrip.participants?.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhum participante ainda. Adicione pessoas para começar!
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GerenciarViagemPage;
