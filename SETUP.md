# 🎯 GUIA RÁPIDO DE CONFIGURAÇÃO

## 🚀 Início Rápido (5 minutos)

### 1. Instalar dependências
```powershell
npm install
```

### 2. Configurar Firebase

#### Passo a passo detalhado:

1. **Criar projeto no Firebase**
   - Acesse: https://console.firebase.google.com/
   - Clique em "Adicionar projeto"
   - Nome: `viagem-colaborativa` (ou o que preferir)
   - Desative o Google Analytics (opcional)
   - Clique em "Criar projeto"

2. **Ativar Authentication**
   - No menu lateral: Authentication
   - Clique em "Vamos começar"
   - Aba "Sign-in method"
   - Clique em "E-mail/senha"
   - Ative a primeira opção (E-mail/senha)
   - Salve

3. **Ativar Firestore**
   - No menu lateral: Firestore Database
   - Clique em "Criar banco de dados"
   - Escolha "Iniciar no modo de teste"
   - Escolha a localização (southamerica-east1 para Brasil)
   - Clique em "Ativar"

4. **Copiar credenciais**
   - No menu lateral: Configurações do projeto (ícone de engrenagem)
   - Role até "Seus apps"
   - Clique no ícone `</>` (Web)
   - Registre o app: `Viagem Colaborativa`
   - NÃO marque Firebase Hosting
   - Clique em "Registrar app"
   - Copie as credenciais que aparecem

5. **Criar arquivo .env**
   - Copie o arquivo `.env.example` para `.env`
   - Cole suas credenciais:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Iniciar o projeto
```powershell
npm run dev
```

### 4. Abrir no navegador
```
http://localhost:5173
```

## 📝 Primeiro Uso

1. **Criar conta**
   - Clique em "Criar conta"
   - Preencha: Nome, E-mail, Senha
   - Faça login

2. **Criar primeira viagem manualmente**
   
   Como a funcionalidade de criação de viagem está simplificada, você pode criar manualmente no Firestore:

   - Acesse Firebase Console → Firestore
   - Clique em "Iniciar coleção"
   - ID da coleção: `trips`
   - Adicione documento:
     ```
     Campo: name | Tipo: string | Valor: "Minha Viagem"
     Campo: participants | Tipo: array | Valor: [seu-user-id]
     Campo: createdBy | Tipo: string | Valor: seu-user-id
     Campo: createdAt | Tipo: timestamp | Valor: (data atual)
     ```
   
   Para pegar seu `user-id`:
   - Vá em Authentication → Users
   - Copie o UID do usuário que você criou

3. **Começar a usar**
   - Recarregue a página
   - Adicione eventos ao roteiro
   - Cadastre despesas
   - Veja a história gerada automaticamente

## 🎨 Testando os Recursos

### Adicionar um Voo
1. Vá em "Roteiro"
2. Clique em "Adicionar Evento"
3. Selecione tipo "Voo"
4. Preencha:
   - Título: "Voo GRU → CDG"
   - Data: (escolha uma data)
   - Hora: 14:00
   - Local: "Aeroporto de Guarulhos"
   - Descrição: "Air France AF123"
5. Clique em "Adicionar"

### Adicionar uma Despesa
1. Vá em "Financeiro"
2. Clique em "Adicionar Despesa"
3. Selecione categoria "Aéreo"
4. Preencha:
   - Descrição: "Passagem Paris"
   - Valor: 2500
   - Data: (hoje)
   - Quem pagou: Você
   - Dividir entre: (marque todos)
5. Clique em "Adicionar"

### Ver a História
1. Vá em "História"
2. A narrativa será gerada automaticamente
3. Clique em "Copiar Texto" ou "Baixar (.md)"

## 🔍 Verificando se está funcionando

### Firebase conectado?
- Abra o Console do navegador (F12)
- Não deve ter erros de conexão
- Se aparecer "Firebase not configured", revise o arquivo `.env`

### Dados sincronizando?
- Abra em duas abas/navegadores diferentes
- Faça login com a mesma conta
- Adicione um evento em uma aba
- Deve aparecer instantaneamente na outra

### PWA instalável?
- No Chrome, deve aparecer um ícone de + na barra de endereço
- Se não aparecer, verifique:
  - Se está em HTTPS ou localhost
  - Se o manifest está carregando (aba Network do DevTools)

## ❓ Problemas Comuns

### "Vite não é reconhecido"
```powershell
npm install
```

### "Module not found"
```powershell
rm -r node_modules
npm install
```

### Firestore Permission Denied
1. Firebase Console → Firestore → Rules
2. Cole as regras do README.md
3. Publique

### Eventos/Despesas não aparecem
1. Verifique se criou a viagem no Firestore
2. Verifique se o UID do participante está correto
3. Recarregue a página

## 📱 Instalar como App

### Windows
1. Chrome → Menu (três pontinhos) → "Instalar Viagem Colaborativa"
2. O app aparece como atalho no menu Iniciar

### Android
1. Chrome → Menu → "Adicionar à tela inicial"
2. O app aparece como ícone normal

### iOS
1. Safari → Botão de compartilhar
2. "Adicionar à Tela de Início"

## 🎉 Pronto!

Agora você tem um PWA colaborativo de viagem totalmente funcional!

**Próximos passos:**
- Convide amigos (eles precisam criar conta e você adiciona o UID deles nos participantes)
- Planeje sua próxima viagem
- Compartilhe a história gerada

---

💡 **Dica:** Para testar a colaboração em tempo real, abra o app em modo anônimo e crie outro usuário!
