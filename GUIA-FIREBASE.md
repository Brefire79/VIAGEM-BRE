# 🔥 GUIA COMPLETO - Configuração Firebase

**Atualizado**: 20 de Janeiro de 2026  
**Tempo estimado**: 15-20 minutos  
**Nível**: Iniciante  

---

## 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se de ter:

- ✅ Conta Google (Gmail)
- ✅ Node.js instalado (v18 ou superior)
- ✅ Dependências do projeto instaladas (`npm install`)

---

## 🎯 PASSO 1: Criar Projeto no Firebase

### 1.1 Acessar o Console do Firebase

Abra seu navegador e acesse:
```
https://console.firebase.google.com/
```

### 1.2 Criar Novo Projeto

1. Clique no botão **"Adicionar projeto"** ou **"Create a project"**
2. Preencha os campos:
   - **Nome do projeto**: `viagem-bre` (ou o nome que preferir)
   - Clique em **"Continuar"**
3. **Google Analytics**: 
   - Desative (opcional para este projeto)
   - OU mantenha ativado se quiser estatísticas
4. Clique em **"Criar projeto"**
5. Aguarde alguns segundos até aparecer "Seu projeto está pronto"
6. Clique em **"Continuar"**

---

## 🔐 PASSO 2: Configurar Authentication (Autenticação)

### 2.1 Ativar Authentication

1. No menu lateral esquerdo, clique em **"Authentication"** (ou **"Autenticação"**)
2. Clique no botão **"Vamos começar"** ou **"Get started"**

### 2.2 Ativar Login com E-mail e Senha

1. Clique na aba **"Sign-in method"** (ou **"Método de login"**)
2. Na lista de provedores, clique em **"E-mail/senha"** (Email/Password)
3. No popup que abrir:
   - ✅ Ative a primeira opção: **"E-mail/senha"** (Email/Password)
   - ❌ NÃO ative "Link de e-mail" (Email link)
4. Clique em **"Salvar"**

✅ **Status esperado**: E-mail/senha deve aparecer como "Ativado" na lista

---

## 📊 PASSO 3: Configurar Firestore Database

### 3.1 Criar Banco de Dados

1. No menu lateral esquerdo, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"** ou **"Create database"**

### 3.2 Escolher Modo de Segurança

Você verá duas opções:

- **Modo de produção** (Production mode)
- **Modo de teste** (Test mode) ✅ **← Escolha esta**

**Selecione "Modo de teste"** para começar rapidamente.

> ⚠️ **Importante**: No modo de teste, as regras expiram em 30 dias. Vamos configurar regras de segurança depois.

### 3.3 Escolher Localização

1. Escolha a localização mais próxima:
   - **southamerica-east1** (São Paulo, Brasil) ✅ Recomendado
   - OU **us-central1** (padrão)
   
2. Clique em **"Ativar"** ou **"Enable"**
3. Aguarde alguns segundos até o banco ser criado

✅ **Status esperado**: Você verá a interface do Firestore vazia (sem coleções ainda)

---

## 🔑 PASSO 4: Copiar Credenciais do Firebase

### 4.1 Registrar Aplicativo Web

1. No menu lateral, clique no **ícone de engrenagem ⚙️** (Configurações)
2. Clique em **"Configurações do projeto"** (Project settings)
3. Role a página até a seção **"Seus apps"** (Your apps)
4. Clique no ícone **`</>`** (Web) para registrar um app web

### 4.2 Registrar o App

1. Preencha os campos:
   - **Apelido do app**: `Viagem Bre Web App` (ou o que preferir)
   - **Firebase Hosting**: ❌ NÃO marque esta opção (vamos usar Netlify)
2. Clique em **"Registrar app"**

### 4.3 Copiar as Credenciais

Você verá um código JavaScript parecido com isto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_exemplo123456789abcdefgh",
  authDomain: "viagem-bre-12345.firebaseapp.com",
  projectId: "viagem-bre-12345",
  storageBucket: "viagem-bre-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

📋 **Copie esses valores** - você vai precisar deles no próximo passo!

---

## 📝 PASSO 5: Configurar Variáveis de Ambiente

### 5.1 Criar Arquivo .env

1. Abra o projeto no VS Code
2. Na raiz do projeto, crie um arquivo chamado **`.env`**
   - ❗ É apenas `.env` (sem extensão adicional)
   - ❗ O arquivo já existe como `.env.example` - você pode copiar

**Opção A**: Copiar o exemplo (recomendado)
```powershell
Copy-Item .env.example .env
```

**Opção B**: Criar manualmente
- Clique com botão direito na raiz do projeto
- "Novo arquivo" → digite `.env`

### 5.2 Preencher as Credenciais

Abra o arquivo `.env` e cole suas credenciais do Firebase:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC_exemplo123456789abcdefgh
VITE_FIREBASE_AUTH_DOMAIN=viagem-bre-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=viagem-bre-12345
VITE_FIREBASE_STORAGE_BUCKET=viagem-bre-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

⚠️ **Substitua os valores de exemplo pelos seus valores reais!**

### 5.3 Verificar o Arquivo .gitignore

Certifique-se de que o arquivo `.gitignore` contém:

```
.env
.env.local
```

Isso garante que suas credenciais **NÃO** sejam enviadas ao GitHub.

---

## ⚙️ PASSO 6: Ativar o Firebase no Código

### 6.1 Abrir arquivo firebase.js

Localize o arquivo: `src/firebase.js`

### 6.2 Alterar Modo de Desenvolvimento

Encontre a linha:

```javascript
const USE_MOCK_DATA = true;
```

Altere para:

```javascript
const USE_MOCK_DATA = false;
```

Isso fará o app conectar ao Firebase real ao invés de usar dados mock.

---

## 🚀 PASSO 7: Iniciar o Aplicativo

### 7.1 Parar o Servidor (se estiver rodando)

Se o servidor já estiver rodando, pare com:
- `Ctrl + C` no terminal
- Digite `S` ou `Y` para confirmar

### 7.2 Iniciar o Servidor

```powershell
npm run dev
```

### 7.3 Abrir no Navegador

O terminal mostrará algo como:
```
  VITE v5.1.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abra: **http://localhost:5173/**

---

## 👤 PASSO 8: Criar Sua Primeira Conta

### 8.1 Página de Login

1. Você verá a página de login
2. Clique em **"Criar conta"**

### 8.2 Preencher Dados

1. **Nome**: Seu nome completo
2. **E-mail**: Seu e-mail válido
3. **Senha**: Mínimo 6 caracteres
4. Clique em **"Criar Conta"**

### 8.3 Confirmar no Firebase Console

Para verificar que funcionou:

1. Volte ao Firebase Console
2. Vá em **Authentication**
3. Aba **"Users"** (Usuários)
4. ✅ Você deve ver seu usuário criado na lista

---

## 🗺️ PASSO 9: Criar Sua Primeira Viagem

### 9.1 Acessar Firestore Console

1. No Firebase Console, vá em **Firestore Database**
2. Você verá "Nenhuma coleção" (banco vazio)

### 9.2 Criar Coleção "trips"

1. Clique em **"Iniciar coleção"** (Start collection)
2. **ID da coleção**: digite `trips`
3. Clique em **"Próximo"**

### 9.3 Adicionar Primeiro Documento

Preencha os campos:

| Campo | Tipo | Valor |
|-------|------|-------|
| **Campo 1** |
| Nome do campo: | `name` |
| Tipo: | `string` |
| Valor: | `Minha Viagem de Teste` |
| **Campo 2** |
| Nome do campo: | `destination` |
| Tipo: | `string` |
| Valor: | `Paris, França` |
| **Campo 3** |
| Nome do campo: | `participants` |
| Tipo: | `array` |
| Valor array[0]: | `[SEU_USER_ID]` ← ver abaixo |
| **Campo 4** |
| Nome do campo: | `createdBy` |
| Tipo: | `string` |
| Valor: | `[SEU_USER_ID]` ← ver abaixo |
| **Campo 5** |
| Nome do campo: | `createdAt` |
| Tipo: | `timestamp` |
| Valor: | (clique no relógio para usar data atual) |

#### Como pegar seu USER_ID:

1. Vá em **Authentication** → **Users**
2. Copie o **UID** do seu usuário (algo como: `abc123XYZ456...`)
3. Cole esse UID nos campos `participants` e `createdBy`

### 9.4 Salvar

Clique em **"Salvar"**

✅ Sua primeira viagem foi criada!

---

## 🎉 PASSO 10: Testar o App

### 10.1 Recarregar o App

1. Volte para o navegador (http://localhost:5173/)
2. Aperte `F5` ou `Ctrl + R` para recarregar

### 10.2 Verificar Funcionalidades

Teste cada página:

#### 📅 Página Roteiro
1. Clique em **"Roteiro"** no menu
2. Clique no botão **"+"** (Adicionar Evento)
3. Preencha:
   - Tipo: `Passeio`
   - Título: `Torre Eiffel`
   - Data: Escolha uma data
   - Hora: `10:00`
   - Local: `Champ de Mars`
4. Clique em **"Salvar"**
5. ✅ O evento deve aparecer na timeline

#### 💰 Página Financeiro
1. Clique em **"Financeiro"** no menu
2. Clique no botão **"+"** (Adicionar Despesa)
3. Preencha:
   - Categoria: `Passeios`
   - Descrição: `Ingresso Torre Eiffel`
   - Valor: `50.00`
   - Data: Escolha uma data
   - Pago por: (seu nome)
   - Dividir entre: Selecione participantes
4. Clique em **"Salvar"**
5. ✅ A despesa deve aparecer e os cálculos atualizarem

#### 📖 Página História
1. Clique em **"História"** no menu
2. ✅ Você deve ver um texto gerado automaticamente com seus eventos

---

## 🔒 PASSO 11: Configurar Regras de Segurança (Importante!)

### 11.1 Por que configurar regras?

O **modo de teste** expira em 30 dias. Depois disso, ninguém conseguirá ler/escrever dados.

### 11.2 Configurar Regras Básicas

1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **"Regras"** (Rules)
3. Substitua o conteúdo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Viagens
    match /trips/{tripId} {
      // Permitir leitura/escrita apenas para participantes
      allow read, write: if request.auth != null && 
                            request.auth.uid in resource.data.participants;
      // Permitir criação se o usuário está autenticado
      allow create: if request.auth != null;
    }
    
    // Eventos
    match /events/{eventId} {
      // Permitir apenas usuários autenticados
      allow read, write: if request.auth != null;
    }
    
    // Despesas
    match /expenses/{expenseId} {
      // Permitir apenas usuários autenticados
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Clique em **"Publicar"** (Publish)

✅ Agora seu app está protegido e funcionará por tempo indeterminado!

---

## 🐛 SOLUÇÃO DE PROBLEMAS COMUNS

### ❌ Erro: "Firebase: Error (auth/invalid-api-key)"

**Causa**: Credenciais incorretas no `.env`

**Solução**:
1. Verifique se copiou corretamente do Firebase Console
2. Certifique-se de que não tem espaços extras
3. Reinicie o servidor (`Ctrl+C` e `npm run dev`)

---

### ❌ Erro: "Firebase: Error (auth/operation-not-allowed)"

**Causa**: Authentication não foi ativado

**Solução**:
1. Vá no Firebase Console → Authentication
2. Aba "Sign-in method"
3. Ative "E-mail/senha"

---

### ❌ Página em branco / Nada aparece

**Causa**: `USE_MOCK_DATA` ainda está como `true`

**Solução**:
1. Abra `src/firebase.js`
2. Altere `USE_MOCK_DATA = true` para `false`
3. Reinicie o servidor

---

### ❌ Erro: "Missing or insufficient permissions"

**Causa**: Regras do Firestore não permitem acesso

**Solução**:
1. Vá no Firebase Console → Firestore Database
2. Aba "Regras"
3. Copie as regras do **PASSO 11**
4. Clique em "Publicar"

---

### ❌ Eventos/Despesas não aparecem

**Causa**: Falta criar a viagem no Firestore

**Solução**:
1. Siga o **PASSO 9** para criar a primeira viagem
2. Certifique-se de usar seu USER_ID correto
3. Recarregue a página

---

## 📚 PRÓXIMOS PASSOS

Agora que seu app está configurado, você pode:

1. ✅ Adicionar mais eventos ao roteiro
2. ✅ Cadastrar despesas e ver os cálculos automáticos
3. ✅ Convidar outras pessoas (adicionar UIDs no array `participants`)
4. ✅ Exportar relatórios da história
5. ✅ Fazer deploy no Netlify (seguir guia de deploy)

---

## 🎓 RECURSOS ÚTEIS

- 📘 [Documentação Firebase](https://firebase.google.com/docs)
- 📘 [Documentação React](https://react.dev)
- 📘 [Documentação Vite](https://vitejs.dev)
- 🎨 [Tailwind CSS](https://tailwindcss.com)
- ⚡ [Framer Motion](https://www.framer.com/motion)

---

## 💡 DICAS IMPORTANTES

### Segurança
- ✅ Nunca commite o arquivo `.env` no Git
- ✅ Use regras de segurança no Firestore (PASSO 11)
- ✅ Mude para modo produção antes do deploy final

### Performance
- ✅ O Firebase tem quota gratuita generosa (50k leituras/dia)
- ✅ Para projetos maiores, considere implementar cache
- ✅ Use índices compostos se consultas ficarem lentas

### Desenvolvimento
- ✅ Use `USE_MOCK_DATA = true` para desenvolver sem gastar quota
- ✅ Teste sempre com dados reais antes do deploy
- ✅ Mantenha backup dos dados importantes

---

**Configuração concluída! 🎉**

Se tiver algum problema, consulte a seção de **Solução de Problemas** ou verifique os logs do console do navegador (F12).
