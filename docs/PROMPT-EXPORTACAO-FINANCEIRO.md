# PROMPT ESTRUTURADO – EXPORTAÇÃO DE RESUMO FINANCEIRO
## Metodologia PTC FREE

## 🎭 PERSONA
Você é um **Product Designer + Backend Engineer Sênior** especializado em:
- Geração e exportação de relatórios
- Design de documentos PDF/Excel
- Formatação de dados financeiros
- UX de exportação (formatos, customização)
- Bibliotecas: jsPDF, xlsx, html2canvas

Você entende que **relatórios devem ser autossuficientes** — quem recebe precisa entender sem precisar abrir o app.

---

## 📋 TAREFA
Implementar um **sistema de exportação do resumo financeiro** que permita aos usuários:

- Baixar relatório completo da viagem
- Escolher formato (PDF, Excel, TXT)
- Incluir/excluir seções (despesas detalhadas, balanço por pessoa, gráficos)
- Compartilhar via WhatsApp/Email
- Imprimir com formatação adequada

---

## 🔍 CONTEXTO
- App colaborativo de viagem
- Múltiplos participantes dividindo despesas
- Necessidade de prestação de contas clara
- Uso mobile-first
- Possível impressão para documentação

---

## 🎯 FORMATOS OBRIGATÓRIOS

### 1️⃣ PDF (Prioridade Alta)
**Quando usar:**
- Compartilhamento oficial
- Impressão
- Arquivamento
- Envio por email

**Biblioteca recomendada:** `jsPDF` + `html2canvas`

**Estrutura do documento:**
```
[CAPA]
- Nome da viagem
- Período (dd/mm - dd/mm)
- Total gasto
- Logo/ícone do app

[RESUMO EXECUTIVO]
- Total geral
- Total por categoria (gráfico de pizza)
- Número de despesas
- Participantes

[BALANÇO POR PESSOA]
Tabela clara:
| Nome      | Pagou    | Deve Pagar | Saldo    |
|-----------|----------|------------|----------|
| Maria     | R$ 1.200 | R$ 850     | +R$ 350  |
| João      | R$ 800   | R$ 1.150   | -R$ 350  |

[DESPESAS DETALHADAS]
Agrupadas por categoria:
- Data | Descrição | Valor | Pago por | Dividido entre

[RODAPÉ]
- Data de geração
- Gerado por [App Name]
```

**Configurações:**
```javascript
{
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
  compress: true,
  margins: { top: 20, bottom: 20, left: 15, right: 15 }
}
```

---

### 2️⃣ Excel/CSV (Prioridade Média)
**Quando usar:**
- Análise avançada
- Controle em planilha
- Importação em outros sistemas

**Biblioteca recomendada:** `xlsx` ou `papaparse`

**Abas do arquivo:**
1. **Resumo**
   - Total geral
   - Por categoria
   - Por pessoa

2. **Despesas**
   - ID | Data | Categoria | Descrição | Valor | Pago por | Dividido entre | IDs participantes

3. **Balanço**
   - Nome | Total Pago | Deve Pagar | Saldo | Status

**Formatação:**
- Moeda: R$ #.##0,00
- Datas: DD/MM/YYYY
- Saldos positivos em verde, negativos em vermelho

---

### 3️⃣ TXT (Prioridade Baixa)
**Quando usar:**
- Compatibilidade máxima
- Envio rápido por mensagem
- Cópia/cola simples

**Exemplo de formato:**
```txt
═══════════════════════════════════════
    RESUMO FINANCEIRO - [NOME VIAGEM]
═══════════════════════════════════════

📅 Período: 15/03/2026 - 22/03/2026
💰 Total Gasto: R$ 15.380,00
👥 Participantes: 4 pessoas
📝 Despesas: 10 lançamentos

───────────────────────────────────────
BALANÇO POR PESSOA
───────────────────────────────────────

✓ Maria Silva
  Pagou: R$ 4.200,00
  Deve pagar: R$ 3.845,00
  Saldo: +R$ 355,00 (receber)

⚠ João Santos
  Pagou: R$ 2.800,00
  Deve pagar: R$ 3.845,00
  Saldo: -R$ 1.045,00 (pagar)

[continua...]

───────────────────────────────────────
DESPESAS POR CATEGORIA
───────────────────────────────────────

✈️  Aéreo: R$ 8.500,00 (55%)
🏨 Hospedagem: R$ 3.200,00 (21%)
🍽️  Alimentação: R$ 2.180,00 (14%)
[continua...]

───────────────────────────────────────
Gerado em: 19/01/2026 às 14:30
Aplicativo: Viagem Colaborativa
───────────────────────────────────────
```

---

## 🎨 INTERFACE DE EXPORTAÇÃO

### Modal/Drawer de Exportação
```
[Ícone Download] Exportar Resumo Financeiro

┌─────────────────────────────────────┐
│ Escolha o formato:                  │
│                                     │
│ ○ PDF - Completo (Recomendado)     │
│   Ideal para impressão e envio      │
│                                     │
│ ○ Excel/CSV - Para análise         │
│   Editável em planilhas             │
│                                     │
│ ○ Texto - Simples e rápido         │
│   Para copiar/colar                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ O que incluir:                      │
│                                     │
│ ☑ Resumo geral                      │
│ ☑ Balanço por pessoa                │
│ ☑ Despesas detalhadas               │
│ ☐ Gráficos (apenas PDF)             │
│ ☐ Observações/notas                 │
└─────────────────────────────────────┘

[Cancelar]  [Exportar →]
```

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### Instalação de dependências
```bash
npm install jspdf jspdf-autotable html2canvas xlsx
```

### Estrutura de código
```javascript
// utils/exportFinancial.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = async (tripData, options) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Capa
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(tripData.name, 105, 40, { align: 'center' });
  
  // Resumo executivo
  doc.setFontSize(16);
  doc.text('Resumo Financeiro', 20, 60);
  
  // Total
  doc.setFontSize(14);
  doc.text(`Total: ${formatCurrency(tripData.total)}`, 20, 70);
  
  // Tabela de balanço
  doc.autoTable({
    startY: 80,
    head: [['Participante', 'Pagou', 'Deve Pagar', 'Saldo']],
    body: tripData.participants.map(p => [
      p.name,
      formatCurrency(p.paid),
      formatCurrency(p.shouldPay),
      formatCurrency(p.balance)
    ]),
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 102, 204] }
  });
  
  // Despesas detalhadas
  if (options.includeExpenses) {
    doc.addPage();
    doc.text('Despesas Detalhadas', 20, 20);
    
    doc.autoTable({
      startY: 30,
      head: [['Data', 'Categoria', 'Descrição', 'Valor']],
      body: tripData.expenses.map(e => [
        formatDate(e.date),
        e.category,
        e.description,
        formatCurrency(e.amount)
      ])
    });
  }
  
  // Rodapé
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      105, 
      287, 
      { align: 'center' }
    );
  }
  
  // Download
  doc.save(`resumo-financeiro-${tripData.name}.pdf`);
};

export const exportToExcel = (tripData) => {
  const wb = XLSX.utils.book_new();
  
  // Aba: Resumo
  const summaryData = [
    ['Total Geral', tripData.total],
    ['Despesas', tripData.expenseCount],
    ['Participantes', tripData.participantCount],
    [],
    ['Por Categoria', 'Valor'],
    ...Object.entries(tripData.byCategory)
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Resumo');
  
  // Aba: Despesas
  const expensesData = [
    ['Data', 'Categoria', 'Descrição', 'Valor', 'Pago por'],
    ...tripData.expenses.map(e => [
      formatDate(e.date),
      e.category,
      e.description,
      e.amount,
      e.paidBy
    ])
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(expensesData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Despesas');
  
  // Aba: Balanço
  const balanceData = [
    ['Nome', 'Pagou', 'Deve Pagar', 'Saldo'],
    ...tripData.participants.map(p => [
      p.name,
      p.paid,
      p.shouldPay,
      p.balance
    ])
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(balanceData);
  XLSX.utils.book_append_sheet(wb, ws3, 'Balanço');
  
  // Download
  XLSX.writeFile(wb, `resumo-financeiro-${tripData.name}.xlsx`);
};

export const exportToText = (tripData) => {
  let text = '';
  
  text += '═'.repeat(40) + '\n';
  text += `  RESUMO FINANCEIRO - ${tripData.name}\n`;
  text += '═'.repeat(40) + '\n\n';
  
  text += `📅 Período: ${tripData.dateRange}\n`;
  text += `💰 Total: ${formatCurrency(tripData.total)}\n`;
  text += `👥 Participantes: ${tripData.participantCount}\n\n`;
  
  text += '─'.repeat(40) + '\n';
  text += 'BALANÇO POR PESSOA\n';
  text += '─'.repeat(40) + '\n\n';
  
  tripData.participants.forEach(p => {
    text += `${p.balance >= 0 ? '✓' : '⚠'} ${p.name}\n`;
    text += `  Pagou: ${formatCurrency(p.paid)}\n`;
    text += `  Saldo: ${formatCurrency(p.balance)}\n\n`;
  });
  
  // Download
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resumo-financeiro-${tripData.name}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## 📤 COMPARTILHAMENTO INTEGRADO

### WhatsApp
```javascript
const shareToWhatsApp = (text) => {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
```

### Email
```javascript
const shareByEmail = (subject, body) => {
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
};
```

### Web Share API (mobile)
```javascript
const shareNative = async (file, title) => {
  if (navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: title,
        files: [file]
      });
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  }
};
```

---

## ⚠️ REGRAS DE VALIDAÇÃO

Antes de exportar, verificar:
- [ ] Viagem tem pelo menos 1 despesa
- [ ] Todos valores são números válidos
- [ ] Datas estão no formato correto
- [ ] Nomes de participantes não estão vazios
- [ ] Saldos somam zero (validação matemática)

---

## 🎨 UX/UI GUIDELINES

**Botão de Exportação:**
- Posição: Destaque na página Financeiro
- Label: "Exportar Resumo" ou "Baixar Relatório"
- Ícone: Download
- Estilo: Primário ou secundário com ícone

**Feedback Visual:**
- Loading durante geração (PDF pode demorar)
- Toast de sucesso: "Relatório baixado!"
- Mensagem de erro clara se falhar

**Preview antes de exportar:**
- Opcional: mostrar preview do PDF
- Útil para validar formatação

---

## 📱 CONSIDERAÇÕES MOBILE

- Exportação deve funcionar em mobile
- PDF: tamanho otimizado (< 5MB)
- Usar Web Share API quando disponível
- Fallback: download direto

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Instalar dependências (jsPDF, xlsx)
- [ ] Criar utils/exportFinancial.js
- [ ] Implementar exportToPDF()
- [ ] Implementar exportToExcel()
- [ ] Implementar exportToText()
- [ ] Criar modal de escolha de formato
- [ ] Adicionar opções de customização
- [ ] Implementar Web Share API
- [ ] Testar em mobile e desktop
- [ ] Testar impressão do PDF
- [ ] Validar formatação de valores
- [ ] Adicionar loading states

---

## 📚 REFERÊNCIAS
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [jsPDF AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- [xlsx (SheetJS)](https://docs.sheetjs.com/)
- [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

---

**Use este prompt para implementar exportação profissional de relatórios financeiros!**
