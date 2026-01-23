# 🧪 INSTRUÇÕES DE TESTE LOCAL

## ✅ Server Rodando
O servidor Vite está em: **http://localhost:5174/**

---

## 🐛 DEBUGGING

### Para ver os logs de debug:
1. **Abra DevTools**: Pressione `F12` no navegador
2. **Vá à aba "Console"**
3. Procure por mensagens que começam com `[DEBUG]`

---

## 🎯 Testes para Fazer

### 1️⃣ **Teste de Criação de Evento**

**Passo 1: Login**
- Acesse http://localhost:5174/
- Faça login com uma conta teste

**Passo 2: Criar Primeira Viagem**
- Clique em "Criar primeira viagem"
- Preencha:
  - Nome: "Teste São Paulo"
  - Destino: "SP"
- Clique "Criar"

**Passo 3: Adicionar Evento**
- Vá para a página **ROTEIRO**
- Clique em **"+ Novo Evento"**
- Preencha:
  - Tipo: "Voo"
  - Título: "Voo GRU para São Paulo"
  - Descrição: "Decolagem 10:30"
  - Data: Escolha uma data
  - Horário: 10:30
  - Local: "Aeroporto GRU"
- Clique **"Adicionar"**

**Passo 4: Verificar no Console**
- Abra **Console (F12)**
- Você deve ver:
  ```
  [DEBUG] Evento criado: XXXXX para trip XXXXX
  [DEBUG] Carregados 1 eventos para trip XXXXX
  ```

**Passo 5: Verificar se Aparece**
- A página **Roteiro** deve mostrar o evento adicionado
- Se não aparecer, há problema no listener

---

### 2️⃣ **Teste de Criação de Despesa**

**Passo 1: Ir para Financeiro**
- Clique na aba **FINANCEIRO**

**Passo 2: Adicionar Despesa**
- Clique em **"+ Nova Despesa"**
- Preencha:
  - Categoria: "Aéreo"
  - Descrição: "Passagem GRU-SP"
  - Valor: "500,00"
  - Data: Escolha uma data
  - Quem pagou: Seu email deve estar selecionado
  - Dividir entre: Você deve estar marcado
- Clique **"Adicionar"**

**Passo 3: Verificar no Console**
- Você deve ver:
  ```
  [DEBUG] Despesa criada: XXXXX para trip XXXXX
  [DEBUG] Carregadas 1 despesas para trip XXXXX
  ```

**Passo 4: Verificar se Aparece**
- A página **Financeiro** deve mostrar a despesa
- Os cálculos devem atualizar

---

### 3️⃣ **Teste de História**

**Passo 1: Ir para História**
- Clique na aba **HISTÓRIA**

**Passo 2: Verificar**
- Se você tem **PELO MENOS 1 evento**, a história deve aparecer
- Se não há eventos, aparecerá mensagem "Sua história está sendo escrita..."

---

### 4️⃣ **Teste de Adicionar Participante**

**Passo 1: Ir para Gerenciar**
- Clique na aba **GERENCIAR**

**Passo 2: Adicionar Novo Participante**
- Clique em **"+ Adicionar Participante"**
- Digite um email de outro usuário (você precisa ter outra conta registrada no Firebase)
- Clique **"Adicionar"**

**Passo 3: Verificar no Console**
- Se sucesso:
  ```
  Participante adicionado com sucesso!
  ```
- Se erro, você verá a mensagem de erro

---

## 🔍 Checklist de Problemas

### ❌ Eventos não aparecem?
- [ ] Console mostra `[DEBUG] Carregados 0 eventos`?
  - Significa que o listener está conectado mas não traz dados do Firestore
  - **Solução**: Verificar Firestore Rules

- [ ] Console não mostra nada?
  - Significa que o listener não está sendo criado
  - **Solução**: Verificar se `currentTrip` está sendo carregado

- [ ] Erro "Nenhuma viagem selecionada"?
  - Significa `currentTrip` é `null` ou `db` não está inicializado
  - **Solução**: Verificar Firebase credentials

### ❌ Despesas não aparecem?
- Mesmas causas acima

### ❌ História não gera?
- [ ] Você criou **pelo menos 1 evento**?
- [ ] Console mostra `[DEBUG] Carregados 1 eventos`?
- Se sim, a história DEVE aparecer

### ❌ Não consegue adicionar participante?
- [ ] Email existe no Firebase?
- [ ] O outro usuário está registrado?
- [ ] Você está adicionando um email diferente do seu?

---

## 📱 Comandos Úteis no Console

**Ver viagem atual:**
```javascript
// Abra o Console (F12) e digite:
// (depois de logar, claro)
```

**Limpar logs:**
```javascript
console.clear()
```

**Ver dados do localStorage:**
```javascript
localStorage
```

---

## 🚨 Problemas Comuns

### Erro: "Firestore precondition failed"
- **Causa**: Firestore Rules bloqueando
- **Solução**: Ajustar rules no Firebase Console
- **Regra temporária para dev**:
  ```
  allow read, write: if request.auth != null;
  ```

### Erro: "User not found"
- **Causa**: Email não existe no Firestore /users
- **Solução**: Criar outra conta primeiro

### Dados somem ao reload?
- **Causa**: Firebase não persistindo
- **Solução**: Normalmente funciona em 2-3 segundos

---

## ✅ Quando Tudo Funciona

Você deve ver:
1. ✅ Evento aparece na página Roteiro
2. ✅ Despesa aparece na página Financeiro
3. ✅ Cálculos atualizam (total, balanço por pessoa)
4. ✅ História aparece na página História (com eventos)
5. ✅ Participante adiciona sem erro

---

## 📝 Próximas Ações

Depois que testar:
1. Copie os logs do console
2. Me mande uma print com os erros (se houver)
3. Diga qual dos 5 testes falhou

**AINDA NÃO FAÇA GIT PUSH!**
