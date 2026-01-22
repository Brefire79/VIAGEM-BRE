# 🚀 INÍCIO RÁPIDO - Configuração Firebase

**Tempo estimado**: 15-20 minutos

---

## 📂 DOCUMENTAÇÃO DISPONÍVEL

Escolha o formato que preferir:

| Documento | Descrição | Quando usar |
|-----------|-----------|-------------|
| [GUIA-FIREBASE.md](GUIA-FIREBASE.md) | 📘 Guia completo com screenshots e detalhes | **Recomendado para primeira vez** |
| [CHECKLIST-FIREBASE.md](CHECKLIST-FIREBASE.md) | ✅ Lista de tarefas para acompanhar | Para marcar progresso |
| [SETUP.md](SETUP.md) | ⚡ Resumo rápido | Para consulta rápida |
| Este arquivo | 🎯 Visão geral | Para orientação inicial |

---

## 🎯 FLUXO DE CONFIGURAÇÃO

```
1. Firebase Console          2. Código Local           3. Teste
   └─ Criar projeto            └─ Configurar .env        └─ Criar conta
   └─ Ativar Auth             └─ Ativar Firebase        └─ Criar viagem
   └─ Ativar Firestore        └─ Iniciar servidor       └─ Testar features
   └─ Copiar credenciais
```

---

## ⚡ COMANDOS PRINCIPAIS

```powershell
# Instalar dependências
npm install

# Copiar arquivo de exemplo
Copy-Item .env.example .env

# Editar arquivo .env (adicionar credenciais do Firebase)
code .env

# Iniciar servidor de desenvolvimento
npm run dev

# Abrir no navegador
start http://localhost:5173
```

---

## 🔑 CREDENCIAIS QUE VOCÊ VAI PRECISAR

Copie do Firebase Console e cole no arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=.....................
VITE_FIREBASE_AUTH_DOMAIN=..........firebaseapp.com
VITE_FIREBASE_PROJECT_ID=..........
VITE_FIREBASE_STORAGE_BUCKET=..........appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=..........
VITE_FIREBASE_APP_ID=..........
```

---

## 📋 CHECKLIST MÍNIMO

Antes de começar a usar o app, certifique-se:

- [ ] ✅ Firebase Console: Projeto criado
- [ ] ✅ Firebase Console: Authentication ativado (E-mail/Senha)
- [ ] ✅ Firebase Console: Firestore Database criado (Modo teste)
- [ ] ✅ Arquivo `.env` criado com credenciais
- [ ] ✅ `src/firebase.js`: `USE_MOCK_DATA = false`
- [ ] ✅ Servidor rodando sem erros
- [ ] ✅ Primeira conta criada no app
- [ ] ✅ Primeira viagem criada no Firestore

---

## 🐛 PROBLEMAS COMUNS

### Erro: "Firebase: Error (auth/invalid-api-key)"
➡️ **Solução**: Verifique as credenciais no `.env` e reinicie o servidor

### Erro: "Missing or insufficient permissions"
➡️ **Solução**: Configure as regras de segurança no Firestore (ver GUIA-FIREBASE.md)

### App em branco / Nada aparece
➡️ **Solução**: Altere `USE_MOCK_DATA = false` em `src/firebase.js`

### Eventos não aparecem
➡️ **Solução**: Crie a primeira viagem manualmente no Firestore (ver GUIA-FIREBASE.md passo 9)

---

## 📞 PRECISA DE AJUDA DETALHADA?

👉 **Vá para**: [GUIA-FIREBASE.md](GUIA-FIREBASE.md)

Este guia contém:
- ✅ Passo a passo com imagens
- ✅ Explicação de cada etapa
- ✅ Solução de todos os problemas comuns
- ✅ Exemplos práticos
- ✅ Dicas de segurança e performance

---

## 🎉 APÓS CONFIGURAR

Uma vez configurado, você poderá:

1. ✈️ **Criar eventos** - Voos, transfers, hospedagens, passeios
2. 💰 **Controlar despesas** - Divisão automática entre participantes
3. 📖 **Gerar história** - Narrativa automática da viagem
4. 👥 **Colaborar** - Múltiplos usuários editando em tempo real
5. 🌐 **Deploy** - Publicar no Netlify (ver documentação de deploy)

---

## 📚 ESTRUTURA DO PROJETO

```
viagem-Bre/
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── contexts/       # Contextos (Auth, Trip)
│   ├── pages/          # Páginas principais
│   ├── utils/          # Utilidades e helpers
│   ├── data/           # Dados mock
│   └── firebase.js     # ⚠️ Configuração Firebase
├── .env                # ⚠️ Credenciais (criar)
├── .env.example        # Exemplo de credenciais
├── GUIA-FIREBASE.md    # 📘 Guia completo
├── CHECKLIST-FIREBASE.md # ✅ Checklist
└── README.md           # Documentação principal
```

---

## 🔒 SEGURANÇA

⚠️ **IMPORTANTE**:

- ❌ NUNCA commite o arquivo `.env` no Git
- ✅ Sempre use regras de segurança no Firestore
- ✅ Configure modo produção antes do deploy final
- ✅ Revogue credenciais se expostas acidentalmente

---

## 💡 DICAS

1. **Desenvolvimento**: Use `USE_MOCK_DATA = true` para não gastar quota Firebase
2. **Teste**: Sempre teste com dados reais antes de fazer deploy
3. **Backup**: Exporte dados importantes do Firestore regularmente
4. **Monitoramento**: Acompanhe uso de quota no Firebase Console

---

**Bom desenvolvimento! 🚀**

Se surgir qualquer dúvida, consulte o [GUIA-FIREBASE.md](GUIA-FIREBASE.md) para instruções detalhadas.
