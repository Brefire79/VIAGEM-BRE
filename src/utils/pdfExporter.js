import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Utilitário para exportar elementos HTML como PDF
 */
export class PDFExporter {
  constructor() {
    this.defaultOptions = {
      format: 'a4',
      orientation: 'portrait',
      unit: 'mm',
      compress: true,
      quality: 0.8,
      margin: 20
    };
  }

  /**
   * Exporta um elemento HTML como PDF
   * @param {HTMLElement} element - Elemento HTML para exportar
   * @param {string} filename - Nome do arquivo PDF
   * @param {Object} options - Opções de configuração
   * @returns {Promise<boolean>} - Sucesso da operação
   */
  async exportElementToPDF(element, filename, options = {}) {
    try {
      const config = { ...this.defaultOptions, ...options };
      
      // Criar canvas do elemento
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        ...config.canvasOptions
      });

      // Criar PDF
      const pdf = new jsPDF({
        orientation: config.orientation,
        unit: config.unit,
        format: config.format,
        compress: config.compress
      });

      const imgData = canvas.toDataURL('image/png', config.quality);
      
      // Calcular dimensões
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const marginX = config.margin;
      const marginY = config.margin;
      
      const availableWidth = pdfWidth - (marginX * 2);
      const availableHeight = pdfHeight - (marginY * 2);
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      // Centralizar horizontalmente
      const x = marginX + (availableWidth - finalWidth) / 2;
      const y = marginY;

      // Adicionar imagem ao PDF
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      
      // Salvar arquivo
      pdf.save(`${filename}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      return false;
    }
  }

  /**
   * Exporta dados financeiros como PDF
   * @param {Object} data - Dados da viagem e despesas
   * @param {string} filename - Nome do arquivo
   * @returns {Promise<boolean>}
   */
  async exportFinanceReport(data, filename = 'relatorio-financeiro') {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const margin = 20;
      let yPosition = margin;

      // Configurações de fonte
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(0, 51, 102); // Cor ocean

      // Título
      pdf.text('Relatório Financeiro da Viagem', margin, yPosition);
      yPosition += 15;

      // Informações da viagem
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      if (data.trip) {
        pdf.text(`Viagem: ${data.trip.name}`, margin, yPosition);
        yPosition += 7;
        
        if (data.trip.destination) {
          pdf.text(`Destino: ${data.trip.destination}`, margin, yPosition);
          yPosition += 7;
        }
        
        if (data.trip.startDate && data.trip.endDate) {
          const startDate = new Date(data.trip.startDate).toLocaleDateString('pt-BR');
          const endDate = new Date(data.trip.endDate).toLocaleDateString('pt-BR');
          pdf.text(`Período: ${startDate} - ${endDate}`, margin, yPosition);
          yPosition += 7;
        }
      }

      yPosition += 10;

      // Resumo financeiro
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Resumo Financeiro', margin, yPosition);
      yPosition += 10;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);

      if (data.summary) {
        pdf.text(`Total Gasto: R$ ${data.summary.total.toFixed(2)}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Número de Despesas: ${data.summary.count}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Gasto Médio: R$ ${data.summary.average.toFixed(2)}`, margin, yPosition);
        yPosition += 10;
      }

      // Lista de despesas
      if (data.expenses && data.expenses.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Despesas Detalhadas', margin, yPosition);
        yPosition += 10;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);

        data.expenses.forEach((expense, index) => {
          if (yPosition > 250) { // Nova página se necessário
            pdf.addPage();
            yPosition = margin;
          }

          const date = expense.date?.toDate ? 
            expense.date.toDate().toLocaleDateString('pt-BR') : 
            new Date(expense.date).toLocaleDateString('pt-BR');

          pdf.text(`${index + 1}. ${expense.description}`, margin, yPosition);
          yPosition += 5;
          pdf.text(`   Valor: R$ ${expense.amount.toFixed(2)} | Data: ${date}`, margin + 5, yPosition);
          yPosition += 5;
          pdf.text(`   Categoria: ${expense.category} | Pago por: ${expense.paidByName || 'N/A'}`, margin + 5, yPosition);
          yPosition += 8;
        });
      }

      // Rodapé
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Página ${i} de ${pageCount}`, margin, 285);
        pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, margin, 290);
      }

      pdf.save(`${filename}.pdf`);
      return true;
    } catch (error) {
      console.error('Erro ao exportar relatório financeiro:', error);
      return false;
    }
  }

  /**
   * Exporta a história da viagem como PDF
   * @param {Object} data - Dados da história
   * @param {string} filename - Nome do arquivo
   * @returns {Promise<boolean>}
   */
  async exportTripStory(data, filename = 'historia-viagem') {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const margin = 20;
      const maxWidth = 170;
      let yPosition = margin;

      // Configurações de fonte
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(0, 51, 102); // Cor ocean

      // Título
      pdf.text('História da Viagem', margin, yPosition);
      yPosition += 15;

      // Informações da viagem
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      if (data.trip) {
        pdf.text(`${data.trip.name}`, margin, yPosition);
        yPosition += 7;
        
        if (data.trip.destination) {
          pdf.text(`${data.trip.destination}`, margin, yPosition);
          yPosition += 7;
        }
      }

      yPosition += 10;

      // História
      if (data.story) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        const storyLines = pdf.splitTextToSize(data.story, maxWidth);
        
        storyLines.forEach((line) => {
          if (yPosition > 270) { // Nova página se necessário
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.text(line, margin, yPosition);
          yPosition += 6;
        });
      }

      // Eventos detalhados
      if (data.events && data.events.length > 0) {
        yPosition += 10;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Eventos da Viagem', margin, yPosition);
        yPosition += 10;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);

        data.events.forEach((event, index) => {
          if (yPosition > 250) { // Nova página se necessário
            pdf.addPage();
            yPosition = margin;
          }

          const date = event.date?.toDate ? 
            event.date.toDate().toLocaleDateString('pt-BR') : 
            new Date(event.date).toLocaleDateString('pt-BR');

          pdf.setFont('helvetica', 'bold');
          pdf.text(`${date} - ${event.title}`, margin, yPosition);
          yPosition += 6;

          if (event.description) {
            pdf.setFont('helvetica', 'normal');
            const descLines = pdf.splitTextToSize(event.description, maxWidth - 10);
            descLines.forEach((line) => {
              if (yPosition > 270) {
                pdf.addPage();
                yPosition = margin;
              }
              pdf.text(line, margin + 5, yPosition);
              yPosition += 5;
            });
          }
          
          yPosition += 5;
        });
      }

      // Rodapé
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Página ${i} de ${pageCount}`, margin, 285);
        pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, margin, 290);
      }

      pdf.save(`${filename}.pdf`);
      return true;
    } catch (error) {
      console.error('Erro ao exportar história da viagem:', error);
      return false;
    }
  }
}

// Instância singleton
export const pdfExporter = new PDFExporter();