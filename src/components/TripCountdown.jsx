import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Plane, Heart, MapPin, Camera, Star, Sun, Moon } from 'lucide-react';
import useTripCountdown from '../hooks/useTripCountdown';

const TripCountdown = ({ startDate, endDate, tripName }) => {
  const { days, hours, minutes, hasStarted, hasEnded, dayOfTrip } = useTripCountdown(startDate, endDate);

  // Mensagens de felicidade que mudam a cada dia
  const getDailyMessage = (day) => {
    const messages = [
      { emoji: "🎉", text: "Sua aventura começou!", icon: Plane },
      { emoji: "🌅", text: "Cada amanhecer traz novas descobertas!", icon: Sun },
      { emoji: "📸", text: "Capturando momentos inesquecíveis!", icon: Camera },
      { emoji: "🗺️", text: "Explorando novos horizontes!", icon: MapPin },
      { emoji: "⭐", text: "Vivendo momentos únicos!", icon: Star },
      { emoji: "💫", text: "Criando memórias especiais!", icon: Heart },
      { emoji: "🌟", text: "Cada dia é uma nova página da sua história!", icon: Calendar },
      { emoji: "🎊", text: "Aproveitando cada segundo desta jornada!", icon: Plane },
      { emoji: "🌈", text: "Descobrindo a magia dos novos lugares!", icon: MapPin },
      { emoji: "✨", text: "Transformando sonhos em realidade!", icon: Star },
      { emoji: "🎆", text: "Celebrando a vida em cada momento!", icon: Heart },
      { emoji: "🌺", text: "Florescendo com cada experiência!", icon: Sun },
      { emoji: "🦋", text: "Voando alto rumo a novas aventuras!", icon: Plane },
      { emoji: "🎵", text: "A trilha sonora perfeita da sua viagem!", icon: Heart },
      { emoji: "🌙", text: "Noites mágicas e dias inesquecíveis!", icon: Moon }
    ];
    
    const messageIndex = (day - 1) % messages.length;
    return messages[messageIndex];
  };

  if (!startDate) return null;

  return (
    <motion.div
      className="bg-gradient-to-br from-ocean to-aqua rounded-2xl p-6 text-white shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      {hasEnded ? (
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h3 className="text-2xl font-bold mb-2">💖 Viagem Concluída!</h3>
          <p className="text-white/80 text-lg">Que as memórias sejam eternas!</p>
        </motion.div>
      ) : hasStarted ? (
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            {(() => {
              const dailyMessage = getDailyMessage(dayOfTrip);
              const IconComponent = dailyMessage.icon;
              return (
                <motion.div
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  key={dayOfTrip} // Força re-render quando muda o dia
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </motion.div>
              );
            })()}
          </div>
          
          <motion.div
            key={dayOfTrip} // Anima quando muda o dia
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-2">
              {getDailyMessage(dayOfTrip).emoji} Dia {dayOfTrip}
            </h3>
            <p className="text-white/90 text-lg mb-4">
              {getDailyMessage(dayOfTrip).text}
            </p>
            <p className="text-white/70 text-sm">
              {tripName ? `Vivendo ${tripName}` : 'Vivendo sua aventura especial'} ✨
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">⏰ Contagem Regressiva</h3>
            <p className="text-white/80 text-sm">
              {tripName ? `Para ${tripName}` : 'Para sua viagem especial'}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <motion.div 
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="text-3xl font-bold mb-1"
                key={days}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                {days}
              </motion.div>
              <div className="text-xs opacity-80 uppercase tracking-wider font-medium">
                {days === 1 ? 'Dia' : 'Dias'}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="text-3xl font-bold mb-1"
                key={hours}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                {hours}
              </motion.div>
              <div className="text-xs opacity-80 uppercase tracking-wider font-medium">
                {hours === 1 ? 'Hora' : 'Horas'}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="text-3xl font-bold mb-1"
                key={minutes}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                {minutes}
              </motion.div>
              <div className="text-xs opacity-80 uppercase tracking-wider font-medium">
                {minutes === 1 ? 'Min' : 'Mins'}
              </div>
            </motion.div>
          </div>
          
          <div className="mt-6 text-center">
            {days === 0 && hours === 0 && (
              <motion.div 
                className="flex items-center justify-center gap-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Plane className="w-4 h-4" />
                <p className="text-sm font-medium">Partida iminente!</p>
              </motion.div>
            )}
            
            {days <= 7 && days > 0 && (
              <motion.div 
                className="flex items-center justify-center gap-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-4 h-4" />
                <p className="text-sm font-medium">Última semana! 🧳</p>
              </motion.div>
            )}
            
            {days > 7 && (
              <motion.div 
                className="flex items-center justify-center gap-2 opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.5 }}
              >
                <Calendar className="w-4 h-4" />
                <p className="text-sm">A aventura está se aproximando...</p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TripCountdown;