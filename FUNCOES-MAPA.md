# 📘 Mapa Completo de Funções - Viagem Colaborativa

## 🏗️ ARQUITETURA

```
src/
├── contexts/         # State management global
│   ├── AuthContext.jsx      # Autenticação
│   └── TripContext.jsx      # Viagens, eventos, despesas
├── pages/           # Páginas principais
│   ├── AuthPage.jsx         # Login/Registro
│   ├── RoteiroPage.jsx      # Eventos do roteiro
│   ├── FinanceiroPage.jsx   # Controle financeiro
│   ├── HistoriaPage.jsx     # Timeline da viagem
│   └── GerenciarViagemPage.jsx  # Config da viagem
├── components/      # Componentes reutilizáveis
│   ├── Layout.jsx           # Header + Bottom Nav
│   └── AnimatedWrapper.jsx  # Wrapper de animações
└── utils/           # Utilitários
    └── motionVariants.js    # Variantes Framer Motion
```

---

## 📦 CONTEXTS

### **AuthContext.jsx** (Autenticação)

#### Exports:
- `useAuth()` - Hook customizado
- `AuthProvider` - Provider component

#### Funções:
1. **`login(email, password)`**
   - **Input:** email (string), password (string)
   - **Output:** `{ success: boolean, user?: User, error?: string }`
   - **Descrição:** Faz login com Firebase Auth
   - **Validações:** Verifica se auth está configurado

2. **`register(email, password, displayName)`**
   - **Input:** email, password, displayName
   - **Output:** `{ success: boolean, user?: User, error?: string }`
   - **Descrição:** Cria conta e salva no Firestore /users
   - **Efeitos:** Atualiza perfil e cria documento de usuário

3. **`logout()`**
   - **Output:** `{ success: boolean, error?: string }`
   - **Descrição:** Faz logout do Firebase Auth
   - **Efeito:** Limpa estado do usuário

#### State:
- `user` - Usuário autenticado (null se deslogado)
- `loading` - Boolean de carregamento inicial

---

### **TripContext.jsx** (Viagens)

#### Exports:
- `useTrip()` - Hook customizado
- `TripProvider` - Provider component

#### State:
- `currentTrip` - Viagem atual do usuário
- `events` - Array de eventos
- `expenses` - Array de despesas
- `participants` - Array de UIDs
- `participantsData` - Object { uid: { displayName, email }}
- `loading` - Boolean

#### Funções de Viagem:

5. **`createTrip(tripData)`**
   - **Input:** `{ name: string, destination: string }`
   - **Output:** `{ success: boolean, tripId?: string, error?: string }`
   - **Descrição:** Cria nova viagem com usuário como criador
   - **Firestore:** Adiciona em /trips

6. **`updateTrip(tripId, tripData)`**
   - **Input:** tripId, partial trip data
   - **Output:** `{ success: boolean, error?: string }`
   - **Descrição:** Atualiza dados da viagem
   - **Validação:** Usuário precisa ser participante

#### Funções de Participantes:

7. **`addParticipant(tripId, participantEmail)`**
   - **Input:** tripId (string), participantEmail (string)
   - **Output:** `{ success: boolean, error?: string }`
   - **Descrição:** Busca usuário por email e adiciona à viagem
   - **Validações:**
     - Email válido
     - Usuário existe no Firestore
     - Não é participante duplicado
   - **Firestore:** Usa arrayUnion

8. **`removeParticipant(tripId, participantId)`**
   - **Output:** `{ success: boolean, error?: string }`
   - **Descrição:** Remove participante da viagem
   - **Validações:**
     - Não pode remover criador
     - Usuário precisa ter permissão
   - **Firestore:** Usa arrayRemove

#### Funções de Eventos:

9. **`addEvent(eventData)`**
   - **Input:** `{ type, title, description, date, time, location }`
   - **Output:** `{ success: boolean, error?: string }`
   - **Descrição:** Adiciona evento ao roteiro
   - **Firestore:** /events com tripId linkado

10. **`updateEvent(eventId, eventData)`**
    - **Input:** eventId, partial event data
    - **Output:** `{ success: boolean, error?: string }`
    - **Descrição:** Atualiza evento existente

11. **`deleteEvent(eventId)`**
    - **Output:** `{ success: boolean, error?: string }`
    - **Descrição:** Remove evento do Firestore

#### Funções de Despesas:

12. **`addExpense(expenseData)`**
    - **Input:** `{ category, description, amount, paidBy, splitBetween, date }`
    - **Output:** `{ success: boolean, error?: string }`
    - **Validações:**
      - amount > 0
      - paidBy é participante válido
      - splitBetween tem ao menos 1 pessoa
      - Todos em splitBetween são participantes
    - **Firestore:** /expenses

13. **`updateExpense(expenseId, expenseData)`**
    - **Validações:** Mesmas do addExpense

14. **`deleteExpense(expenseId)`**

#### Listeners (useEffect):

15. **Trip Listener** - Monitora viagem do usuário
16. **Events Listener** - Monitora eventos da trip
17. **Expenses Listener** - Monitora despesas da trip
18. **Participants Fetcher** - Busca dados de cada participante

---

## 📄 PAGES

### **AuthPage.jsx**

#### Funções:

19. **`handleLogin(e)`**
    - Previne default
    - Chama `login()` do context
    - Navega para /roteiro em sucesso
    - Mostra erro em caso de falha

20. **`handleRegister(e)`**
    - Validações:
      - Nome não vazio
      - Email válido
      - Senha >= 6 chars
      - Senhas coincidem
    - Chama `register()` do context

21. **`setActiveTab(tab)`**
    - Alterna entre 'login' e 'register'
    - Reseta erros

---

### **RoteiroPage.jsx**

#### State Local:
- `showModal` - Controla modal de evento
- `showTripModal` - Controla modal de criar viagem
- `editingEvent` - Evento sendo editado (null = novo)
- `loading` - Loading de submit
- `successMessage` - Mensagem de sucesso temporária
- `formData` - Dados do formulário de evento
- `tripFormData` - Dados do formulário de viagem

#### Funções:

22. **`handleSubmit(e)` - Submit de Evento**
    - Validações:
      - Data obrigatória
      - Título não vazio
      - Valores numéricos válidos
    - Cria Date object sem timezone
    - Chama addEvent ou updateEvent
    - Mostra sucesso e fecha modal

23. **`handleCreateTrip(e)` - Criar Primeira Viagem**
    - Validações: nome e destino
    - Chama `createTrip()`
    - Fecha modal em sucesso

24. **`handleOpenModal(event)`**
    - Se event passado: modo edição
    - Senão: modo criação (limpa form)
    - Popula formData

25. **`handleCloseModal()`**
    - Fecha modal
    - Reseta formData
    - Limpa editingEvent

26. **`handleDeleteEvent(eventId)`**
    - Confirma com window.confirm
    - Chama deleteEvent

27. **`groupEventsByDate()`**
    - Agrupa eventos por data
    - Retorna object { 'YYYY-MM-DD': [events] }

---

### **FinanceiroPage.jsx**

#### State Local:
- `showModal`
- `editingExpense`
- `formData` - Com splitBetween default = all participants

#### Funções:

28. **`handleSubmit(e)` - Submit de Despesa**
    - Validações:
      - splitBetween não vazio
      - Data válida
      - Amount > 0
    - Cria Date sem timezone
    - Chama addExpense ou updateExpense

29. **`handleOpenModal(expense)`**
    - Se expense: preenche form com dados
    - Senão: preenche com defaults (todos participantes)

30. **`toggleParticipant(participantId)`**
    - Adiciona/remove de splitBetween

31. **`handleDeleteExpense(expenseId)`**
    - Confirma e deleta

32. **`getParticipantName(uid)`**
    - Retorna nome do participante ou 'Carregando...'

33. **`formatCurrency(value)`**
    - Formata número para BRL

#### Cálculos (useMemo):

34. **`calculations`** - Object com:
    - `total` - Soma de todas despesas
    - `byCategory` - Total por categoria
    - `paidByPerson` - Quanto cada um pagou
    - `shouldPayPerPerson` - Quanto cada um deveria pagar
    - `balance` - Diferença (positivo = recebe, negativo = deve)

---

### **GerenciarViagemPage.jsx**

#### Funções:

35. **`handleUpdateTrip()`**
    - Atualiza nome/destino
    - Validações básicas

36. **`handleAddParticipant()`**
    - Validação de email
    - Chama addParticipant
    - Tratamento de erros customizado

37. **`handleRemoveParticipant(participantId)`**
    - Confirmação
    - Chama removeParticipant

---

### **HistoriaPage.jsx**

#### Funções:

38. **`getCombinedTimeline()`**
    - Combina events + expenses
    - Ordena por data
    - Retorna array unificado

39. **`getTimelineIcon(item)`**
    - Retorna ícone baseado no tipo

---

## 🧩 COMPONENTS

### **Layout.jsx**

#### Funções:

40. **`handleSignOut()`**
    - Chama logout do context
    - Navega para /login em sucesso
    - Tratamento de erro

41. **`toggleMobileMenu()`**
    - Alterna estado do menu mobile

---

### **AnimatedWrapper.jsx**

#### Funções:

42. **`AnimatedWrapper({ children, ...props })`**
    - Wrapper para motion.div
    - Aplica variantes de animação

---

## 🔧 UTILS

### **motionVariants.js**

Exports de variantes para Framer Motion:
- `pageVariants` - Transições de página
- `cardVariants` - Animações de card
- `buttonVariants` - Hover/Tap de botões
- `modalOverlayVariants` - Fade de overlay
- `modalContentVariants` - Slide de modal
- `successVariants` - Animação de sucesso

---

## 🔥 FIREBASE

### **firebase.js**

43. **Inicialização**
    - Valida variáveis de ambiente
    - Inicializa app, auth, db
    - **NOVO:** Habilita persistência IndexedDB

#### Exports:
- `auth` - Firebase Auth instance
- `db` - Firestore instance
- `app` - Firebase App

---

## 🎯 HOOKS CUSTOMIZADOS

### **useReducedMotion.js**

44. **`useReducedMotion()`**
    - Detecta preferência do sistema
    - Retorna boolean
    - Usado para desabilitar animações

---

## ⚠️ PROBLEMAS IDENTIFICADOS E CORRIGIDOS

### ❌ REMOVIDOS:
1. **Console.logs** - Todos removidos (produção limpa)
2. **Arquivos duplicados** - AuthContext-v2, TripContext-backup
3. **Manifest.json** - Ícone errado corrigido

### ✅ MELHORIAS APLICADAS:
1. **Persistência offline** - IndexedDB habilitado
2. **Validações fortalecidas** - Todos os forms
3. **Mensagens de erro claras** - Sem expor detalhes sensíveis
4. **Mobile-first** - Touch targets 44px+
5. **PWA otimizado** - Manifest, Service Worker, Cache

---

## 📱 RESPONSIVIDADE

### Breakpoints (Tailwind):
- `sm: 640px` - Tablets pequenos
- `md: 768px` - Tablets
- `lg: 1024px` - Desktop
- `xl: 1280px` - Desktop grande

### Componentes Mobile-First:
- Layout com bottom nav < 768px
- Sidebar em desktop >= 768px
- Modais: 92% width mobile, max-w-2xl desktop
- Inputs: font-size 16px (evita zoom iOS)

---

## 🚀 PERFORMANCE

### Otimizações:
- `useMemo` para cálculos pesados (FinanceiroPage)
- `lazy loading` potencial (não implementado ainda)
- Service Worker cache estratégico
- Firestore persistence para offline

### Lighthouse Targets:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90
- PWA: 100

---

## 🔐 SEGURANÇA

### Implementado:
- Validação no cliente de todos inputs
- Firebase Rules configuradas
- Sem API keys hardcoded
- HTTPS obrigatório
- Sanitização de emails (toLowerCase, trim)

### Sugestões Futuras:
- Rate limiting no Firestore
- Captcha no registro
- Email verification
- 2FA opcional
