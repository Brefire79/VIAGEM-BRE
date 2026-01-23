# 🧪 Guia de Testes - Correções Aplicadas

**Data**: 22 de Janeiro de 2026  
**Status**: ✅ 3 Correções Aplicadas - Aguardando Testes Locais

## ✅ Correções Realizadas

### 1. **DOMPurify - ReferenceError Corrigido** ✅
- **Arquivo**: `src/pages/HistoriaPage.jsx`
- **Problema**: `ReferenceError: DOMPurify is not defined` na linha 290
- **Solução**: Adicionada import `import DOMPurify from 'dompurify';`
- **Impacto**: HistoriaPage agora renderiza sem erro

### 2. **Índice Firestore - Eventos Corrigido** ✅
- **Arquivo**: `src/contexts/TripContext.jsx` (linhas 75-84)
- **Problema**: Query composta `where('tripId') + orderBy('date')` requer índice que não existe
- **Solução**: Removido `orderBy('date', 'asc')` do query
- **Alternativa**: Ordenação feita no frontend com `.sort()` em HistoriaPage.jsx
- **Impacto**: Listener de eventos agora funciona sem erro

### 3. **Índice Firestore - Despesas Corrigido** ✅
- **Arquivo**: `src/contexts/TripContext.jsx` (linhas 99-108)
- **Problema**: Query composta `where('tripId') + orderBy('date')` requer índice
- **Solução**: Removido `orderBy('date', 'desc')` do query
- **Alternativa**: Dados carregados sem ordenação (ordenação no frontend se necessário)
- **Impacto**: Listener de despesas agora funciona sem erro

---

## 📝 Plano de Testes (FAÇA AGORA)

### ✅ TESTE 1: Evento Criado e Exibido
**Passo 1 - Abrir DevTools**
```
Pressione F12 → Abra aba "Console"
```

**Passo 2 - Criar Evento**
```
1. Ir para página "ROTEIRO"
2. Clicar no botão "Adicionar Evento"
3. Preencher:
   - Descrição: "Teste de evento"
   - Data: Hoje
   - Tipo: Passeio
4. Clicar "Salvar"
```

**Passo 3 - Verificar Console**
```
Procure por: "[DEBUG] Evento criado: ..."
Se aparecer ✅ → Evento salvo no Firestore
```

**Passo 4 - Verificar Listener**
```
Procure por: "[DEBUG] Carregados 1 eventos para trip ..."
Se aparecer ✅ → Listener funcionando
```

**Passo 5 - Verificar UI**
```
Procure por evento na lista
Se aparecer ✅ → TESTE 1 APROVADO
```

---

### ✅ TESTE 2: Despesa Criada e Exibida
**Passo 1 - Criar Despesa**
```
1. Ir para página "FINANCEIRO"
2. Clicar no botão "Adicionar Despesa"
3. Preencher:
   - Descrição: "Teste de despesa"
   - Valor: 50.00
   - Categoria: Transporte
4. Clicar "Salvar"
```

**Passo 2 - Verificar Console**
```
Procure por: "[DEBUG] Despesa criada: ..."
Se aparecer ✅ → Despesa salva no Firestore
```

**Passo 3 - Verificar UI**
```
Procure por despesa na lista
Se aparecer ✅ → TESTE 2 APROVADO
```

---

### ✅ TESTE 3: História Renderiza Sem Erro
**Passo 1 - Clicar em "HISTÓRIA"**
```
Se a página abre sem erro branco ✅ → DOMPurify funcionando
```

**Passo 2 - Verificar Conteúdo**
```
Se mostra a história da viagem com eventos ✅ → TESTE 3 APROVADO
```

**Passo 3 - Verificar Console**
```
Se NÃO tem erro "DOMPurify is not defined" ✅ → Correção confirmada
```

---

### ⚠️ TESTE 4: Adicionar Participante
**Importante**: Participante deve estar cadastrado no Firebase!

**Passo 1 - Fazer Login com Conta 2**
```
1. Abra aba incógnita do navegador
2. Acesse mesma URL
3. Crie conta com email: participante@test.com
4. Faça login
```

**Passo 2 - Voltar à Conta Principal**
```
1. Volta à aba normal
2. Vai para "Gerenciar Viagem"
```

**Passo 3 - Adicionar Participante**
```
1. Clique "Adicionar Participante"
2. Digitar: participante@test.com
3. Clicar "Adicionar"
```

**Passo 4 - Verificar**
```
Se email aparece na lista ✅ → TESTE 4 APROVADO
Se erro "Usuário não encontrado" → Conta não criada em aba incógnita
```

---

## 🔍 Verificação de Logs Esperados

Após cada ação, você deve ver NO MÁXIMO estes erros:

### ❌ ERROS QUE DEVEM SER CORRIGIDOS:
```
❌ Erro ao carregar eventos: The query requires an index
❌ Erro ao carregar despesas: The query requires an index
❌ ReferenceError: DOMPurify is not defined
```

### ✅ ERROS QUE PODEM APARECER (normais):
```
✅ "Usuário não encontrado com este e-mail" → Normal se email não existe
✅ "Este usuário já é participante" → Normal se já adicionado
✅ Aviso de IndexedDB → Normal para PWA
```

---

## 📊 Resultado Esperado

Após os 4 testes:

| Teste | Esperado | Status |
|-------|----------|--------|
| 1. Evento criado | Sem erro de índice | ⏳ |
| 2. Despesa criada | Sem erro de índice | ⏳ |
| 3. História renderiza | Sem DOMPurify error | ⏳ |
| 4. Participante | Email salvo ou erro válido | ⏳ |

---

## ❌ Se Algo Não Funcionar

### Problema: Console mostra índice erro ainda
**Solução**: 
1. Pressione Ctrl+Shift+R (hard refresh)
2. Limpe cache do navegador
3. Feche DevTools e reabra

### Problema: DOMPurify undefined após reload
**Solução**:
1. Confirme que `import DOMPurify from 'dompurify';` está na linha 9 de HistoriaPage.jsx
2. Verifique se package.json tem `"dompurify": "^3.3.1"`

### Problema: Email não salva ao adicionar participante
**Solução**:
1. Confirme que criou conta em aba incógnita
2. Use email EXATO que criou a conta
3. Verifique console para erro específico

---

## 📝 Relatório de Teste

**Quando terminar testes, responda com:**

```
✅ TESTE 1 (Evento): [Funcionando / Erro: ...]
✅ TESTE 2 (Despesa): [Funcionando / Erro: ...]
✅ TESTE 3 (História): [Funcionando / Erro: ...]
⚠️  TESTE 4 (Participante): [Funcionando / Erro: ...]

Logs do Console:
[Cole os erros que vê]
```

---

## 🚀 Próximo Passo (Após Testes)

Se todos os 4 testes passarem → `git add . && git commit && git push`

Se houver erros → Responda com detalhes do erro para correção adicional

**NÃO FAÇA GIT PUSH ATÉ CONFIRMAR QUE TUDO FUNCIONA!**
