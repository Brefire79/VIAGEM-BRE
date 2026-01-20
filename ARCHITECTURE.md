# 🏗️ ARQUITETURA DO PROJETO

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                              │
│                    (Navegador / PWA)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE UI                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  AuthPage   │  │ RoteiroPage │  │FinanceiroPage│         │
│  │ (Login/Reg) │  │  (Eventos)  │  │  (Despesas)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                    ┌─────────────┐                          │
│                    │HistoriaPage │                          │
│                    │  (Narrativa)│                          │
│                    └─────────────┘                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE LÓGICA                            │
│  ┌──────────────────┐        ┌──────────────────┐          │
│  │  AuthContext     │        │   TripContext    │          │
│  │  - login()       │        │   - addEvent()   │          │
│  │  - register()    │        │   - addExpense() │          │
│  │  - signOut()     │        │   - calculations │          │
│  └──────────────────┘        └──────────────────┘          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE SDK                              │
│  ┌──────────────────┐        ┌──────────────────┐          │
│  │  Authentication  │        │    Firestore     │          │
│  │  - Email/Pass    │        │  - Real-time DB  │          │
│  │  - User Session  │        │  - Collections   │          │
│  └──────────────────┘        └──────────────────┘          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FIREBASE CLOUD                              │
│         (Autenticação + Banco de Dados)                     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### 1. Autenticação
```
Usuário preenche form
    ↓
AuthContext.login()
    ↓
Firebase Authentication
    ↓
Retorna User object
    ↓
Context atualiza estado
    ↓
UI re-renderiza
    ↓
Redireciona para /roteiro
```

### 2. Adicionar Evento (Tempo Real)
```
Usuário clica "Adicionar"
    ↓
RoteiroPage.handleSubmit()
    ↓
TripContext.addEvent()
    ↓
Firestore.addDoc()
    ↓
Documento salvo no Firebase
    ↓
onSnapshot() detecta mudança
    ↓
Context atualiza eventos[]
    ↓
UI re-renderiza automaticamente
    ↓
TODOS os usuários veem mudança
```

### 3. Cálculos Financeiros
```
Despesas mudam
    ↓
useMemo() recalcula
    ↓
- Total geral
- Total por categoria
- Quanto cada um pagou
- Quanto cada um deveria pagar
- Balanço final
    ↓
UI atualiza com novos valores
```

### 4. Geração de História
```
Eventos + Despesas existem
    ↓
HistoriaPage carrega
    ↓
useMemo() processa dados
    ↓
- Agrupa eventos por tipo
- Calcula estatísticas
- Gera texto narrativo
    ↓
Markdown → HTML
    ↓
Renderiza história
```

## 📁 Estrutura de Diretórios Detalhada

```
viagem-Bre/
│
├── public/                          # Assets estáticos
│   ├── pwa-192x192.png             # Ícone PWA pequeno
│   └── pwa-512x512.png             # Ícone PWA grande
│
├── src/                             # Código fonte
│   │
│   ├── components/                  # Componentes reutilizáveis
│   │   └── Layout.jsx              # Layout principal
│   │       - Header com logo
│   │       - Navegação desktop/mobile
│   │       - Bottom navigation
│   │       - Botão logout
│   │
│   ├── contexts/                    # Contextos React
│   │   ├── AuthContext.jsx         # Gerencia autenticação
│   │   │   - Estado: user, loading
│   │   │   - Funções: login, register, signOut
│   │   │   - Monitora: onAuthStateChanged
│   │   │
│   │   └── TripContext.jsx         # Gerencia viagem
│   │       - Estado: currentTrip, events, expenses, participants
│   │       - Funções CRUD: add/update/delete
│   │       - Sincronização: onSnapshot
│   │
│   ├── pages/                       # Páginas da aplicação
│   │   │
│   │   ├── AuthPage.jsx            # Login/Registro
│   │   │   - Formulário responsivo
│   │   │   - Tabs login/registro
│   │   │   - Validação de campos
│   │   │   - Mensagens de erro
│   │   │
│   │   ├── RoteiroPage.jsx         # Roteiro colaborativo
│   │   │   - Lista de eventos por data
│   │   │   - Modal criar/editar
│   │   │   - Tipos: voo, transfer, etc
│   │   │   - Ações: editar, excluir
│   │   │
│   │   ├── FinanceiroPage.jsx      # Controle financeiro
│   │   │   - Cards de resumo
│   │   │   - Gastos por categoria
│   │   │   - Balanço por pessoa
│   │   │   - Lista de despesas
│   │   │   - Modal criar/editar
│   │   │   - Cálculos automáticos
│   │   │
│   │   └── HistoriaPage.jsx        # História da viagem
│   │       - Geração automática
│   │       - Preview formatado
│   │       - Botão copiar
│   │       - Botão download .md
│   │
│   ├── App.jsx                      # Configuração de rotas
│   │   - BrowserRouter
│   │   - ProtectedRoute
│   │   - PublicRoute
│   │   - Redirecionamentos
│   │
│   ├── main.jsx                     # Ponto de entrada
│   │   - ReactDOM.render
│   │   - StrictMode
│   │
│   ├── firebase.js                  # Configuração Firebase
│   │   - initializeApp
│   │   - auth export
│   │   - db export
│   │
│   └── index.css                    # Estilos globais
│       - TailwindCSS imports
│       - Classes customizadas
│       - Animações
│       - Scrollbar
│
├── index.html                       # HTML base
│   - Meta tags PWA
│   - Theme color
│   - Root div
│
├── vite.config.js                   # Configuração Vite
│   - Plugin React
│   - Plugin PWA
│   - Manifest
│   - Service Worker
│
├── tailwind.config.js               # Configuração Tailwind
│   - Cores customizadas
│   - Extensões de tema
│
├── postcss.config.js                # PostCSS
│   - Tailwind plugin
│   - Autoprefixer
│
├── package.json                     # Dependências
│   - react, react-dom
│   - react-router-dom
│   - firebase
│   - date-fns
│   - lucide-react
│   - vite, tailwindcss
│
├── .env.example                     # Template de variáveis
├── .gitignore                       # Arquivos ignorados
│
├── README.md                        # Documentação principal
├── SETUP.md                         # Guia de setup
├── EXAMPLES.md                      # Exemplos de dados
├── CHECKLIST.md                     # Checklist completo
└── ARCHITECTURE.md                  # Este arquivo
```

## 🔗 Dependências e Suas Funções

### Dependências de Produção
```json
{
  "react": "^18.3.1",              // Framework UI
  "react-dom": "^18.3.1",          // Renderização DOM
  "react-router-dom": "^6.22.0",   // Roteamento SPA
  "firebase": "^10.8.0",           // Backend (Auth + DB)
  "lucide-react": "^0.344.0",      // Ícones modernos
  "date-fns": "^3.3.1"             // Manipulação de datas
}
```

### Dependências de Desenvolvimento
```json
{
  "@vitejs/plugin-react": "^4.2.1",   // Plugin Vite para React
  "vite": "^5.1.0",                    // Build tool rápido
  "vite-plugin-pwa": "^0.19.0",        // PWA automation
  "tailwindcss": "^3.4.1",             // CSS utility-first
  "autoprefixer": "^10.4.17",          // CSS prefixes
  "postcss": "^8.4.35"                 // CSS processing
}
```

## 🎨 Sistema de Design

### Hierarquia de Cores
```css
Primária:    #0EA5E9 (Ocean Blue)    → Ações principais
Secundária:  #2DD4BF (Aqua Green)    → Ações secundárias
Background:  #F8FAFC (Sand Light)    → Fundo
Texto:       #0F172A (Dark Gray)     → Texto principal

Categorias de Eventos/Despesas:
- Voo:          #0EA5E9 (Ocean)
- Transfer:     #2DD4BF (Aqua)
- Hospedagem:   #A855F7 (Purple)
- Passeios:     #22C55E (Green)
- Alimentação:  #F97316 (Orange)
- Outros:       #6B7280 (Gray)
```

### Componentes Base
```css
.card        → Container com sombra e border-radius
.btn-primary → Botão azul preenchido
.btn-secondary → Botão verde preenchido
.btn-outline → Botão com borda
.input       → Campo de entrada com foco azul
.badge       → Tag pequena para categorias
```

### Breakpoints
```css
sm:  640px   → Tablet pequeno
md:  768px   → Tablet
lg:  1024px  → Desktop
xl:  1280px  → Desktop grande
```

## 🔐 Modelo de Segurança

### Camadas de Proteção
```
1. Frontend
   - ProtectedRoute (impede acesso não autenticado)
   - Validação de formulários
   - Feedback visual de erros

2. Firebase Authentication
   - Email/senha com hash
   - Tokens JWT automáticos
   - Sessão persistente

3. Firestore Rules (configurar)
   - Ler: apenas participantes
   - Escrever: apenas participantes
   - Validação de dados
```

### Regras Firestore Recomendadas
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função auxiliar
    function isParticipant(tripId) {
      return request.auth.uid in 
        get(/databases/$(database)/documents/trips/$(tripId)).data.participants;
    }
    
    // Viagens
    match /trips/{tripId} {
      allow read: if request.auth != null && isParticipant(tripId);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && isParticipant(tripId);
      
      // Eventos
      match /events/{eventId} {
        allow read, write: if request.auth != null && isParticipant(tripId);
      }
      
      // Despesas
      match /expenses/{expenseId} {
        allow read, write: if request.auth != null && isParticipant(tripId);
      }
    }
  }
}
```

## 📊 Performance

### Otimizações Implementadas
- ✅ useMemo para cálculos pesados
- ✅ Lazy loading de rotas (pode adicionar)
- ✅ Service Worker para cache
- ✅ Imagens otimizadas (SVG)
- ✅ CSS minificado (Vite)
- ✅ Tree shaking automático

### Métricas Esperadas
```
First Contentful Paint:  < 1.5s
Time to Interactive:     < 3.0s
Largest Contentful Paint: < 2.5s
Cumulative Layout Shift:  < 0.1
Speed Index:              < 3.4s
```

## 🔄 Estado e Sincronização

### Fluxo de Estado
```
Firebase (Source of Truth)
    ↓ onSnapshot()
TripContext (Estado Global)
    ↓ Context Provider
Componentes (Estado Local + Props)
    ↓ useState, useEffect
UI (Renderização)
```

### Sincronização Real-time
```javascript
// onSnapshot monitora mudanças
onSnapshot(collection, (snapshot) => {
  // Atualiza automaticamente quando:
  // - Outro usuário adiciona evento
  // - Outro usuário edita despesa
  // - Outro usuário deleta item
  
  // Latência típica: 100-300ms
});
```

## 🧪 Testabilidade

### Áreas para Testar
```
1. Unitários
   - Funções de cálculo financeiro
   - Geração de história
   - Formatação de datas/moedas

2. Integração
   - Fluxo de autenticação
   - CRUD de eventos
   - CRUD de despesas
   - Sincronização

3. E2E
   - Jornada completa do usuário
   - Múltiplos usuários simultâneos
   - Offline → Online
```

## 🚀 Deploy Pipeline

### Desenvolvimento
```
npm run dev → http://localhost:5173
```

### Build
```
npm run build → dist/
```

### Preview Local
```
npm run preview → http://localhost:4173
```

### Produção (Netlify)
```
1. git push
2. Netlify detecta mudança
3. Executa: npm run build
4. Deploy: dist/ → CDN
5. Live em: https://seu-app.netlify.app
```

## 🎯 Escalabilidade

### Limitações Atuais
- 1 viagem por usuário (simplificado)
- Máx. ~100 eventos/despesas (UI)
- Firestore: 1 write/sec/documento

### Para Escalar
1. **Múltiplas viagens**
   - Adicionar tela de lista
   - Seletor de viagem ativa
   
2. **Paginação**
   - Eventos antigos em "Ver mais"
   - Despesas com scroll infinito
   
3. **Otimização de queries**
   - Índices no Firestore
   - Cache local mais agressivo
   
4. **Cloud Functions**
   - Cálculos complexos no backend
   - Notificações push
   - Limpeza de dados

## 📱 PWA Features

### Implementado
- ✅ Instalável
- ✅ Ícones
- ✅ Manifest
- ✅ Service Worker
- ✅ Cache básico

### Pode Adicionar
- [ ] Notificações push
- [ ] Background sync
- [ ] Offline-first
- [ ] Share API
- [ ] File System API

## 🎓 Padrões Utilizados

### React Patterns
- Context API para estado global
- Custom Hooks (useAuth, useTrip)
- Composition over inheritance
- Props drilling evitado

### Firebase Patterns
- Real-time listeners
- Optimistic updates
- Batch operations (opcional)
- Subcollections para dados relacionados

### CSS Patterns
- Utility-first (Tailwind)
- Mobile-first responsive
- BEM naming (classes customizadas)
- CSS-in-JS evitado

---

**Esta arquitetura suporta:**
- ✅ Crescimento gradual
- ✅ Manutenção fácil
- ✅ Testes automatizados
- ✅ Deploy contínuo
- ✅ Colaboração em equipe

🚀 **Pronto para produção!**
