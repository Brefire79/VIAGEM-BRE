# ✅ CHECKLIST DE CONFIGURAÇÃO FIREBASE

Use este checklist para acompanhar seu progresso na configuração do app.

---

## 📋 PREPARAÇÃO

- [ ] Node.js instalado (v18+)
- [ ] Conta Google/Gmail criada
- [ ] VS Code aberto no projeto
- [ ] Dependências instaladas (`npm install`)

---

## 🔥 FIREBASE CONSOLE

### Criar Projeto
- [ ] Acessou https://console.firebase.google.com/
- [ ] Criou novo projeto Firebase
- [ ] Nome do projeto definido
- [ ] Google Analytics configurado (ativado ou desativado)
- [ ] Projeto criado com sucesso

### Authentication
- [ ] Abriu página Authentication
- [ ] Clicou em "Vamos começar"
- [ ] Ativou método "E-mail/senha"
- [ ] Status mostra como "Ativado"

### Firestore Database
- [ ] Abriu página Firestore Database
- [ ] Criou banco de dados
- [ ] Escolheu "Modo de teste"
- [ ] Selecionou localização (southamerica-east1)
- [ ] Banco criado com sucesso

### Credenciais
- [ ] Abriu Configurações do projeto (engrenagem ⚙️)
- [ ] Registrou app web (`</>`)
- [ ] Copiou as 6 credenciais do Firebase
- [ ] Salvou as credenciais em lugar seguro

---

## 💻 CONFIGURAÇÃO LOCAL

### Variáveis de Ambiente
- [ ] Criou arquivo `.env` na raiz do projeto
- [ ] Copiou conteúdo de `.env.example`
- [ ] Colou as credenciais do Firebase no `.env`
- [ ] Verificou que `.env` está no `.gitignore`
- [ ] Salvou o arquivo `.env`

### Código
- [ ] Abriu arquivo `src/firebase.js`
- [ ] Alterou `USE_MOCK_DATA = true` para `false`
- [ ] Salvou o arquivo

### Servidor
- [ ] Parou o servidor se estava rodando (Ctrl+C)
- [ ] Iniciou servidor com `npm run dev`
- [ ] Abriu http://localhost:5173/ no navegador
- [ ] App carregou sem erros

---

## 👤 PRIMEIRA CONTA

### Criar Usuário
- [ ] Clicou em "Criar conta" no app
- [ ] Preencheu nome, e-mail e senha
- [ ] Conta criada com sucesso
- [ ] Verificou usuário no Firebase Console → Authentication

---

## 🗺️ PRIMEIRA VIAGEM

### No Firestore Console
- [ ] Abriu Firestore Database
- [ ] Criou coleção `trips`
- [ ] Pegou seu USER_ID do Authentication
- [ ] Adicionou documento com os campos:
  - [ ] `name` (string)
  - [ ] `destination` (string)
  - [ ] `participants` (array com seu USER_ID)
  - [ ] `createdBy` (string com seu USER_ID)
  - [ ] `createdAt` (timestamp atual)
- [ ] Salvou o documento

### No App
- [ ] Recarregou a página (F5)
- [ ] Viagem aparece no app

---

## 🎯 TESTAR FUNCIONALIDADES

### Página Roteiro
- [ ] Abriu página "Roteiro"
- [ ] Clicou no botão "+"
- [ ] Criou evento de teste
- [ ] Evento aparece na timeline
- [ ] Pode editar o evento
- [ ] Pode excluir o evento

### Página Financeiro
- [ ] Abriu página "Financeiro"
- [ ] Clicou no botão "+"
- [ ] Criou despesa de teste
- [ ] Despesa aparece na lista
- [ ] Cálculos estão corretos
- [ ] Pode editar a despesa
- [ ] Pode excluir a despesa

### Página História
- [ ] Abriu página "História"
- [ ] História gerada automaticamente aparece
- [ ] Texto inclui eventos e despesas criados

---

## 🔒 SEGURANÇA

### Regras do Firestore
- [ ] Abriu Firestore Database → Regras
- [ ] Substituiu regras de teste por regras de produção
- [ ] Clicou em "Publicar"
- [ ] Testou que ainda funciona após publicar

---

## ✅ FINALIZAÇÃO

### Verificação Final
- [ ] App funciona sem erros
- [ ] Pode criar, editar e excluir eventos
- [ ] Pode criar, editar e excluir despesas
- [ ] Cálculos financeiros corretos
- [ ] História é gerada corretamente
- [ ] Dados persistem após recarregar página

### Documentação
- [ ] Li o GUIA-FIREBASE.md completo
- [ ] Entendi como funcionam as regras de segurança
- [ ] Sei onde encontrar soluções de problemas

---

## 🎉 PARABÉNS!

Se todos os itens acima estão marcados, sua configuração está completa!

**Próximos passos sugeridos**:
1. Adicionar mais eventos e despesas de teste
2. Explorar todas as funcionalidades
3. Preparar para deploy (ver documentação de deploy)
4. Convidar outras pessoas para testar

---

## 📞 PRECISA DE AJUDA?

- Problemas comuns: Ver seção "Solução de Problemas" no GUIA-FIREBASE.md
- Dúvidas sobre Firebase: https://firebase.google.com/docs
- Documentação do app: Ver arquivos README.md e ARCHITECTURE.md

---

**Data de conclusão**: _______________  
**Tempo gasto**: _______________  
**Dificuldades encontradas**: 
- 
- 
- 
