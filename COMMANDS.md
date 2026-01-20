# 🛠️ COMANDOS ÚTEIS

## 📦 Instalação e Setup

### Instalar todas as dependências
```powershell
npm install
```

### Instalar dependência específica
```powershell
npm install nome-do-pacote
```

### Atualizar dependências
```powershell
npm update
```

---

## 🚀 Desenvolvimento

### Iniciar servidor de desenvolvimento
```powershell
npm run dev
```
Abre em: http://localhost:5173

### Iniciar em porta específica
```powershell
npm run dev -- --port 3000
```

### Limpar cache e reiniciar
```powershell
rm -r node_modules
rm package-lock.json
npm install
npm run dev
```

---

## 🏗️ Build e Preview

### Build para produção
```powershell
npm run build
```
Gera pasta `dist/` com arquivos otimizados

### Preview do build localmente
```powershell
npm run preview
```
Abre em: http://localhost:4173

### Build com análise de bundle
```powershell
npm run build -- --mode production
```

---

## 🔥 Firebase

### Login no Firebase
```powershell
npm install -g firebase-tools
firebase login
```

### Inicializar Firebase
```powershell
firebase init
```

### Deploy no Firebase Hosting
```powershell
npm run build
firebase deploy
```

### Ver logs do Firestore
```powershell
firebase firestore:logs
```

---

## 🧪 Testes (se configurar)

### Executar testes
```powershell
npm test
```

### Executar testes em modo watch
```powershell
npm test -- --watch
```

### Cobertura de testes
```powershell
npm test -- --coverage
```

---

## 📱 PWA

### Verificar manifest
```powershell
# Abra DevTools (F12)
# Application → Manifest
```

### Testar Service Worker
```powershell
# Abra DevTools (F12)
# Application → Service Workers
# Marque "Offline"
```

### Limpar cache do PWA
```powershell
# DevTools (F12) → Application
# Clear storage → Clear site data
```

---

## 🐛 Debug

### Ver erros do build
```powershell
npm run build -- --debug
```

### Verificar versões
```powershell
node -v          # Node.js
npm -v           # npm
npx vite --version   # Vite
```

### Limpar cache do Vite
```powershell
rm -r node_modules/.vite
npm run dev
```

---

## 📊 Análise

### Tamanho do bundle
```powershell
npm run build
# Veja os tamanhos no terminal
```

### Análise visual do bundle (opcional)
```powershell
npm install -D rollup-plugin-visualizer
# Adicione plugin no vite.config.js
npm run build
# Abre visualizer.html
```

---

## 🔒 Segurança

### Verificar vulnerabilidades
```powershell
npm audit
```

### Corrigir vulnerabilidades
```powershell
npm audit fix
```

### Atualizar Firebase SDK
```powershell
npm install firebase@latest
```

---

## 📦 Git

### Inicializar repositório
```powershell
git init
git add .
git commit -m "Initial commit: PWA Viagem Colaborativa"
```

### Adicionar remote
```powershell
git remote add origin https://github.com/seu-usuario/viagem-colaborativa.git
git push -u origin main
```

### Commit rápido
```powershell
git add .
git commit -m "Sua mensagem"
git push
```

---

## 🌐 Deploy Netlify

### Via CLI
```powershell
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Via GitHub (recomendado)
1. Faça push para GitHub
2. Conecte repositório no Netlify
3. Configure variáveis de ambiente
4. Deploy automático em cada push

---

## 🔍 Debugging Firebase

### Verificar conexão
```javascript
// Adicione no console do navegador:
console.log(firebase.app().name); // '[DEFAULT]'
```

### Verificar autenticação
```javascript
// No console:
firebase.auth().currentUser
```

### Verificar dados do Firestore
```javascript
// No console:
firebase.firestore().collection('trips').get()
  .then(snap => console.log(snap.docs.map(d => d.data())))
```

---

## 📱 Testes Mobile

### Android (Chrome)
```
chrome://inspect
# Conecte dispositivo via USB
# Inspecionar página
```

### iOS (Safari)
```
Safari → Preferências → Avançado → Mostrar menu Desenvolver
Desenvolver → [Seu iPhone] → localhost
```

---

## 🎨 Tailwind

### Gerar configuração completa
```powershell
npx tailwindcss init --full
```

### Compilar CSS manualmente
```powershell
npx tailwindcss -i ./src/index.css -o ./dist/output.css
```

---

## 📊 Performance

### Lighthouse (Chrome DevTools)
```
F12 → Lighthouse → Analyze
```

### Bundle analyzer
```powershell
npm run build -- --sourcemap
# Use source-map-explorer
```

---

## 🔄 Atualizar Projeto

### Atualizar Vite
```powershell
npm install vite@latest
```

### Atualizar React
```powershell
npm install react@latest react-dom@latest
```

### Atualizar TailwindCSS
```powershell
npm install tailwindcss@latest
```

### Atualizar todas
```powershell
npm update
```

---

## 🆘 Solução de Problemas

### Porta em uso
```powershell
# Windows: encontrar processo
netstat -ano | findstr :5173
# Matar processo
taskkill /PID <numero> /F

# Ou use porta diferente
npm run dev -- --port 3000
```

### Módulo não encontrado
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Firebase erro 401
```
# Verifique .env
# Confirme que credenciais estão corretas
# Reinicie o servidor
```

### Build falha
```powershell
# Limpe tudo
rm -r dist
rm -r node_modules/.vite
npm run build
```

---

## 📝 Scripts Úteis

### Verificar formato de código (se configurar)
```powershell
npm run format
```

### Lint (se configurar ESLint)
```powershell
npm run lint
```

### Type check (se migrar para TypeScript)
```powershell
npm run type-check
```

---

## 🎯 Comandos de Produção

### Build otimizado
```powershell
npm run build
```

### Preview de produção
```powershell
npm run preview
```

### Deploy Netlify
```powershell
npm run build
netlify deploy --prod
```

### Deploy Firebase
```powershell
npm run build
firebase deploy --only hosting
```

---

## 🔗 Links Úteis

### Documentações
- React: https://react.dev
- Vite: https://vitejs.dev
- Firebase: https://firebase.google.com/docs
- TailwindCSS: https://tailwindcss.com
- React Router: https://reactrouter.com

### Ferramentas
- Firebase Console: https://console.firebase.google.com
- Netlify Dashboard: https://app.netlify.com
- GitHub: https://github.com

---

## 💡 Dicas

### Performance
```powershell
# Use production build
npm run build

# Analise o bundle
npm run build -- --mode production

# Teste performance
# Lighthouse no Chrome DevTools
```

### Debug
```powershell
# React DevTools
# Instale extensão do Chrome

# Firebase Emulators (opcional)
firebase emulators:start
```

### Colaboração
```powershell
# Configure múltiplos participantes
# Firebase Console → Authentication → Users
# Copie UIDs e adicione no array participants
```

---

**Salve este arquivo como referência rápida!** 📌

Comandos mais usados:
- `npm install` → Instalar
- `npm run dev` → Desenvolver
- `npm run build` → Build
- `git add . && git commit -m "msg" && git push` → Git
