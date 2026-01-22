# 🔒 GUIA DE SEGURANÇA - Viagem Colaborativa

## 📋 Checklist de Segurança

### ✅ Configurações Implementadas

#### 1. Proteção de Credenciais
- ✅ Arquivo `.env` no `.gitignore`
- ✅ Variáveis de ambiente usando `import.meta.env`
- ✅ Nunca fazer commit do arquivo `.env`
- ✅ Arquivo `.env.example` para referência (sem valores reais)

#### 2. Regras de Segurança do Firestore
- ✅ Arquivo `firestore.rules` criado
- ✅ Autenticação obrigatória para todas as operações
- ✅ Usuários só podem ler/editar seus próprios dados
- ✅ Participantes só acessam dados de suas viagens
- ✅ Validação de permissões em todas as coleções

#### 3. Regras de Segurança do Storage
- ✅ Arquivo `storage.rules` criado
- ✅ Apenas imagens permitidas
- ✅ Limite de 5MB por arquivo
- ✅ Usuários só podem modificar suas próprias fotos

#### 4. Validações no Código
- ✅ Validação de entrada em todos os formulários
- ✅ Verificação de permissões antes de operações
- ✅ Sanitização de e-mails (trim + toLowerCase)
- ✅ Validação de valores numéricos positivos
- ✅ Proteção contra remoção do criador da viagem

---

## 🛡️ Proteções Contra Ataques Comuns

### 1. **Injection Attacks**
**Proteção:** Firestore usa queries parametrizadas automaticamente
```javascript
// ✅ Seguro - Firestore sanitiza automaticamente
const q = query(usersRef, where('email', '==', email));
```

### 2. **Cross-Site Scripting (XSS)**
**Proteção:** React escapa HTML automaticamente
```jsx
// ✅ Seguro - React escapa automaticamente
<div>{user.displayName}</div>
```

### 3. **Unauthorized Access**
**Proteção:** Regras do Firestore + Validações no código
```javascript
// ✅ Verifica se usuário é participante
if (!tripData.participants.includes(user.uid)) {
  throw new Error('Sem permissão');
}
```

### 4. **Data Tampering**
**Proteção:** Validação de dados antes de salvar
```javascript
// ✅ Valida valores antes de salvar
if (!expenseData.amount || expenseData.amount <= 0) {
  throw new Error('Valor inválido');
}
```

### 5. **Brute Force**
**Proteção:** Firebase Authentication tem rate limiting automático
- Limita tentativas de login
- Bloqueia IPs suspeitos temporariamente

---

## 🔐 Regras de Segurança Detalhadas

### Firestore Rules

#### Usuários (`/users/{userId}`)
- **Read:** Qualquer usuário autenticado
- **Create:** Apenas criar próprio documento
- **Update:** Apenas atualizar próprio perfil
- **Delete:** Bloqueado

#### Viagens (`/trips/{tripId}`)
- **Read:** Apenas participantes
- **Create:** Usuário deve ser criador E participante
- **Update:** Apenas participantes (criador não pode ser removido)
- **Delete:** Apenas o criador

#### Eventos (`/events/{eventId}`)
- **Read:** Participantes da viagem
- **Create:** Participantes da viagem
- **Update:** Participantes da viagem
- **Delete:** Apenas criador do evento

#### Despesas (`/expenses/{expenseId}`)
- **Read:** Participantes da viagem
- **Create:** Participantes + validação de valor > 0
- **Update:** Participantes + valor > 0
- **Delete:** Participantes da viagem

---

## 📝 Como Aplicar as Regras no Firebase

### 1. Via Console Firebase
```bash
1. Acesse https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em "Firestore Database"
4. Clique na aba "Regras"
5. Cole o conteúdo de firestore.rules
6. Clique em "Publicar"
```

### 2. Via CLI Firebase
```bash
# Instalar CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto
firebase init

# Deploy das regras
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## ⚠️ O QUE NUNCA FAZER

### ❌ NUNCA faça commit de:
- `.env` - Credenciais do Firebase
- `.env.local` - Variáveis locais
- `.env.production` - Variáveis de produção
- `firebase-service-account.json` - Chaves privadas
- Senhas ou tokens no código

### ❌ NUNCA use:
```javascript
// ❌ ERRADO - Credenciais hardcoded
const apiKey = "AIzaSyC_SEU_API_KEY_AQUI";

// ❌ ERRADO - Regras abertas no Firestore
allow read, write: if true;

// ❌ ERRADO - Sem validação
const amount = request.data.amount; // Pode ser negativo!
```

### ✅ SEMPRE use:
```javascript
// ✅ CORRETO - Variáveis de ambiente
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// ✅ CORRETO - Regras restritivas
allow read: if isSignedIn() && isParticipant();

// ✅ CORRETO - Com validação
if (amount <= 0) throw new Error('Valor inválido');
```

---

## 🔍 Verificar Vazamentos no Git

### Verificar o que está sendo commitado:
```bash
# Ver status
git status

# Ver diff antes de commit
git diff

# Ver arquivos ignorados
git status --ignored
```

### Se já commitou credenciais acidentalmente:
```bash
# ⚠️ ATENÇÃO: Isso reescreve o histórico!

# 1. Remover arquivo do histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Forçar push (cuidado!)
git push origin --force --all

# 3. TROCAR TODAS AS CREDENCIAIS NO FIREBASE!
# As antigas estão comprometidas!
```

---

## 🚨 Se Suas Credenciais Vazaram

### Ação Imediata:
1. **Desabilitar API Keys antigas:**
   - Firebase Console → Configurações do Projeto
   - Credentials → Restringir/Desabilitar keys comprometidas

2. **Gerar novas credenciais:**
   - Criar novo projeto Firebase OU
   - Regenerar API keys

3. **Atualizar .env:**
   - Usar novas credenciais
   - Verificar .gitignore

4. **Revisar logs de acesso:**
   - Firebase Console → Usage
   - Procurar atividades suspeitas

---

## 🔧 Configurações Adicionais Recomendadas

### 1. Habilitar App Check (Anti-Bot)
```javascript
// firebase.js
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('SEU_RECAPTCHA_SITE_KEY'),
  isTokenAutoRefreshEnabled: true
});
```

### 2. Configurar CORS no Storage
```json
[
  {
    "origin": ["https://seu-dominio.com"],
    "method": ["GET", "POST"],
    "maxAgeSeconds": 3600
  }
]
```

### 3. Habilitar 2FA para Administradores
- Firebase Console → Authentication → Sign-in method
- Ativar autenticação de dois fatores

---

## 📊 Monitoramento de Segurança

### Logs a Observar:
1. **Tentativas de login falhadas** (Firebase Auth)
2. **Regras do Firestore negadas** (Firestore Logs)
3. **Uploads bloqueados** (Storage Logs)
4. **Picos de uso anormais** (Firebase Usage)

### Alertas Recomendados:
- E-mail quando houver muitas tentativas de login
- Alerta de quota excedida
- Notificação de erros de permissão frequentes

---

## ✅ Checklist Final Antes do Deploy

- [ ] `.env` está no `.gitignore`
- [ ] Nenhuma credencial no código
- [ ] Regras do Firestore aplicadas
- [ ] Regras do Storage aplicadas
- [ ] Validações no código implementadas
- [ ] Teste de permissões realizado
- [ ] App Check configurado (opcional)
- [ ] HTTPS habilitado no domínio
- [ ] Backup do banco configurado

---

## 📚 Recursos Adicionais

- [Documentação de Segurança do Firebase](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Checklist](https://firebase.google.com/support/guides/security-checklist)

---

## 🆘 Suporte

Em caso de dúvidas sobre segurança:
- Documentação Firebase: https://firebase.google.com/docs
- Stack Overflow: Tag `firebase` + `security`
- Firebase Support: https://firebase.google.com/support

**Mantenha sempre suas dependências atualizadas:**
```bash
npm audit
npm update
```
