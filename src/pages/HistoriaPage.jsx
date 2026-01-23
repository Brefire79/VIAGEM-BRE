import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrip } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Sparkles, Download, Copy, Check, Save, FileText, File } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { pageVariants, storyParagraphVariants, buttonVariants, modalOverlayVariants, modalContentVariants } from '../utils/motionVariants';
import DOMPurify from 'dompurify';

const HistoriaPage = () => {
  const { user } = useAuth();
  const { currentTrip, events, expenses, participants, participantsData } = useTrip();
  const [copied, setCopied] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  // Gera a história da viagem
  const tripStory = useMemo(() => {
    if (!currentTrip || events.length === 0) return null;

    // Ordena eventos por data
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = a.date?.toDate?.() || new Date(a.date);
      const dateB = b.date?.toDate?.() || new Date(b.date);
      return dateA - dateB;
    });

    const firstEvent = sortedEvents[0];
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    const firstDate = firstEvent.date?.toDate?.() || new Date(firstEvent.date);
    const lastDate = lastEvent.date?.toDate?.() || new Date(lastEvent.date);
    const tripDuration = differenceInDays(lastDate, firstDate) + 1;

    // Agrupa eventos por tipo
    const eventsByType = sortedEvents.reduce((acc, event) => {
      if (!acc[event.type]) acc[event.type] = [];
      acc[event.type].push(event);
      return acc;
    }, {});

    // Cálculos financeiros
    const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    const categoryLabels = {
      aereo: 'passagens aéreas',
      transfer: 'transfers',
      hospedagem: 'hospedagem',
      passeios: 'passeios',
      alimentacao: 'alimentação',
      outros: 'outros gastos'
    };

    // Gera texto da história
    let story = '';

    // Introdução
    story += `# ${currentTrip.name || 'Nossa Viagem Inesquecível'}\n\n`;
    story += `## Uma Aventura de ${tripDuration} ${tripDuration === 1 ? 'Dia' : 'Dias'}\n\n`;
    story += `Entre ${format(firstDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })} e ${format(lastDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}, `;
    
    // Lista de participantes com nomes
    const participantNames = participants.map(id => participantsData[id]?.displayName || id.substring(0, 8));
    if (participantNames.length === 1) {
      story += `${participantNames[0]} embarcou `;
    } else if (participantNames.length === 2) {
      story += `${participantNames[0]} e ${participantNames[1]} embarcaram `;
    } else {
      const lastPerson = participantNames.pop();
      story += `${participantNames.join(', ')} e ${lastPerson} embarcaram `;
    }
    
    story += `em uma jornada memorável. `;
    story += `Esta é a história de como criamos memórias que vão durar para sempre.\n\n`;

    // Seção do roteiro
    story += `## 🗺️ Nosso Roteiro\n\n`;

    if (eventsByType.voo && eventsByType.voo.length > 0) {
      story += `### Voando Alto\n\n`;
      story += `Nossa aventura começou ${eventsByType.voo.length === 1 ? 'com um voo' : `com ${eventsByType.voo.length} voos`}, `;
      story += `levando-nos através dos céus rumo ao destino dos nossos sonhos. `;
      eventsByType.voo.slice(0, 2).forEach(event => {
        story += `${event.title}${event.location ? ` em ${event.location}` : ''}. `;
      });
      story += `\n\n`;
    }

    if (eventsByType.hospedagem && eventsByType.hospedagem.length > 0) {
      story += `### Onde Ficamos\n\n`;
      const accommodation = eventsByType.hospedagem[0];
      story += `Encontramos nosso lar longe de casa em ${accommodation.title}`;
      if (accommodation.location) story += ` (${accommodation.location})`;
      story += `. `;
      if (accommodation.description) {
        story += `${accommodation.description} `;
      }
      story += `Foi o lugar perfeito para descansar entre as aventuras.\n\n`;
    }

    if (eventsByType.passeio && eventsByType.passeio.length > 0) {
      story += `### Explorando o Destino\n\n`;
      story += `Vivemos ${eventsByType.passeio.length} ${eventsByType.passeio.length === 1 ? 'experiência incrível' : 'experiências incríveis'}:\n\n`;
      eventsByType.passeio.forEach(event => {
        const eventDate = event.date?.toDate?.() || new Date(event.date);
        story += `- **${event.title}** - ${format(eventDate, "d 'de' MMMM", { locale: ptBR })}`;
        if (event.description) story += `: ${event.description}`;
        story += `\n`;
      });
      story += `\n`;
    }

    if (eventsByType.alimentacao && eventsByType.alimentacao.length > 0) {
      story += `### Sabores da Viagem\n\n`;
      story += `A gastronomia foi parte essencial da nossa experiência. `;
      story += `Descobrimos ${eventsByType.alimentacao.length} ${eventsByType.alimentacao.length === 1 ? 'lugar especial' : 'lugares especiais'} `;
      story += `para saborear a culinária local, desde refeições simples até experiências gastronômicas memoráveis.\n\n`;
    }

    // Seção financeira
    story += `## 💰 Investimento na Experiência\n\n`;
    story += `Para tornar essa viagem realidade, investimos um total de **${formatCurrency(totalSpent)}**. `;
    
    const expenseCount = expenses.length;
    story += `Ao longo de ${expenseCount} ${expenseCount === 1 ? 'transação' : 'transações'}, `;
    story += `gerenciamos cuidadosamente nossos recursos para aproveitar ao máximo cada momento.\n\n`;

    story += `### Distribuição dos Gastos\n\n`;
    Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, amount]) => {
        const percentage = ((amount / totalSpent) * 100).toFixed(1);
        story += `- **${categoryLabels[category] || category}**: ${formatCurrency(amount)} (${percentage}%)\n`;
      });
    story += `\n`;

    // Cálculos financeiros detalhados por participante
    const paidByPerson = expenses.reduce((acc, exp) => {
      acc[exp.paidBy] = (acc[exp.paidBy] || 0) + Number(exp.amount);
      return acc;
    }, {});

    const shouldPayPerPerson = expenses.reduce((acc, exp) => {
      const splitCount = exp.splitBetween.length;
      const amountPerPerson = Number(exp.amount) / splitCount;
      
      exp.splitBetween.forEach(personId => {
        acc[personId] = (acc[personId] || 0) + amountPerPerson;
      });
      
      return acc;
    }, {});

    const balance = {};
    const allParticipants = [...new Set([...Object.keys(paidByPerson), ...Object.keys(shouldPayPerPerson)])];
    
    allParticipants.forEach(personId => {
      const paid = paidByPerson[personId] || 0;
      const shouldPay = shouldPayPerPerson[personId] || 0;
      balance[personId] = paid - shouldPay;
    });

    // Resumo financeiro por pessoa
    story += `### Resumo Financeiro por Participante\n\n`;
    allParticipants.forEach(personId => {
      const participantName = participantsData[personId]?.displayName || personId.substring(0, 8);
      const paid = paidByPerson[personId] || 0;
      const shouldPay = shouldPayPerPerson[personId] || 0;
      const balanceAmount = balance[personId];

      story += `**${participantName}**\n`;
      story += `- Pagou: ${formatCurrency(paid)}\n`;
      story += `- Deve pagar: ${formatCurrency(shouldPay)}\n`;
      
      if (balanceAmount > 0.01) {
        story += `- 💚 Deve receber: ${formatCurrency(balanceAmount)}\n`;
      } else if (balanceAmount < -0.01) {
        story += `- 🔴 Deve pagar: ${formatCurrency(Math.abs(balanceAmount))}\n`;
      } else {
        story += `- ✅ Está quite\n`;
      }
      story += `\n`;
    });
    story += `\n`;

    // Conclusão
    story += `## ✨ Reflexões Finais\n\n`;
    story += `Esta viagem foi mais do que destinos visitados ou dinheiro gasto. `;
    story += `Foi sobre os momentos compartilhados, as risadas, as descobertas e as conexões criadas. `;
    story += `Cada experiência, desde os voos até as refeições, contribuiu para uma jornada que ficará gravada em nossas memórias.\n\n`;
    
    story += `Obrigado por fazer parte desta aventura. Que venham muitas outras!\n\n`;
    story += `---\n\n`;
    story += `*História gerada automaticamente em ${format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}*\n`;

    return story;
  }, [currentTrip, events, expenses, participants, participantsData]);

  const handleCopy = async () => {
    if (tripStory) {
      await navigator.clipboard.writeText(tripStory);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (tripStory) {
      const blob = new Blob([tripStory], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historia-viagem-${format(new Date(), 'yyyy-MM-dd')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveAsText = () => {
    if (tripStory) {
      // Remove markdown formatting para texto puro
      const plainText = tripStory
        .replace(/^#+ /gm, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/^- /gm, '• ');

      const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historia-viagem-${currentTrip.name?.replace(/\s+/g, '-').toLowerCase() || 'viagem'}-${format(new Date(), 'yyyy-MM-dd')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowSaveMenu(false);
    }
  };

  const handleSaveAsMarkdown = () => {
    handleDownload();
    setShowSaveMenu(false);
  };

  const handleSaveAsPDF = () => {
    // Placeholder para futura implementação com jsPDF ou similar
    alert('🚧 Exportação em PDF será implementada em breve!\n\nPor enquanto, você pode:\n• Salvar como texto (.txt)\n• Salvar como Markdown (.md)\n• Copiar e colar em um editor de texto');
    setShowSaveMenu(false);
  };

  // Preview da história em HTML com animação
  const renderStory = (markdown) => {
    // Divide o markdown em seções (por títulos ##)
    const sections = markdown.split(/^## /gm).filter(s => s.trim());
    
    return sections.map((section, index) => {
      // Restaura o ## no início da seção
      const sectionWithTitle = index > 0 ? `## ${section}` : section;
      
      // Conversão simples de Markdown para HTML
      let html = sectionWithTitle
        // Títulos
        .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-dark mt-6 mb-3">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-dark mt-8 mb-4 flex items-center gap-2">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold text-dark mb-2">$1</h1>')
        // Negrito
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-ocean">$1</strong>')
        // Lista
        .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">$1</li>')
        // Itálico
        .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
        // Linha horizontal
        .replace(/^---$/gm, '<hr class="my-6 border-sand-300" />')
        // Parágrafos
        .replace(/^(?!<[h|l|u]|<\/|<hr)(.+)$/gm, '<p class="mb-4 text-dark-50 leading-relaxed">$1</p>');

      // Sanitizar HTML para prevenir XSS
      const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'hr'],
        ALLOWED_ATTR: ['class']
      });

      return { html: sanitizedHtml, index };
    });
  };

  if (!currentTrip) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-sand-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Nenhuma viagem encontrada</h2>
          <p className="text-sand-500">Crie uma viagem para gerar sua história</p>
        </div>
      </div>
    );
  }

  if (!tripStory) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark mb-2">História da Viagem</h1>
          <p className="text-sand-500">
            A história será gerada automaticamente ao adicionar eventos
          </p>
        </div>

        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-sand-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark mb-2">Sua história está sendo escrita...</h3>
          <p className="text-sand-500 mb-4">
            Adicione eventos ao roteiro para gerar a história automática da sua viagem
          </p>
          <p className="text-sm text-sand-400">
            💡 A história será criada com base nos eventos e despesas da viagem
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-dark mb-2 flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-8 h-8 text-ocean" />
          </motion.div>
          História da Viagem
        </motion.h1>
        <motion.p 
          className="text-sand-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Um resumo automático da sua experiência, pronto para compartilhar
        </motion.p>
      </div>

      {/* Ações */}
      <motion.div 
        className="flex flex-wrap gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Botão principal: Salvar História */}
        <div className="relative">
          <motion.button
            onClick={() => setShowSaveMenu(!showSaveMenu)}
            className="btn-primary flex items-center gap-2 shadow-md"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Save className="w-5 h-5" />
            Salvar história da viagem
          </motion.button>

          {/* Menu dropdown de opções de salvamento */}
          <AnimatePresence>
            {showSaveMenu && (
              <motion.div
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-sand-200 overflow-hidden z-10"
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-2">
                  <motion.button
                    onClick={handleSaveAsText}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sand-50 transition-colors text-left"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText className="w-5 h-5 text-ocean" />
                    <div>
                      <div className="font-medium text-dark">Texto simples (.txt)</div>
                      <div className="text-xs text-sand-500">Sem formatação</div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={handleSaveAsMarkdown}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sand-50 transition-colors text-left"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <File className="w-5 h-5 text-ocean" />
                    <div>
                      <div className="font-medium text-dark">Markdown (.md)</div>
                      <div className="text-xs text-sand-500">Com formatação</div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={handleSaveAsPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sand-50 transition-colors text-left opacity-60"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-5 h-5 text-sand-400" />
                    <div>
                      <div className="font-medium text-dark">PDF (.pdf)</div>
                      <div className="text-xs text-sand-500">Em breve 🚧</div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={handleCopy}
          className="btn-secondary flex items-center gap-2"
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copiar Texto
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Overlay para fechar menu ao clicar fora */}
      <AnimatePresence>
        {showSaveMenu && (
          <motion.div
            className="fixed inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSaveMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* Preview da história com animação progressiva */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="prose prose-lg max-w-none">
          {renderStory(tripStory).map(({ html, index }) => (
            <motion.div
              key={index}
              variants={storyParagraphVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dica */}
      <motion.div 
        className="mt-6 p-4 bg-ocean-50 border border-ocean-200 rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.3 }}
      >
        <p className="text-sm text-ocean-700">
          💡 <strong>Dica:</strong> Você pode copiar este texto e colar em um documento, 
          compartilhar nas redes sociais ou salvar como lembrança da viagem!
        </p>
      </motion.div>

      {/* Informação sobre atualização */}
      <motion.div 
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <p className="text-xs text-sand-500">
          Esta história é atualizada automaticamente conforme você adiciona eventos e despesas
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HistoriaPage;
