# ✅ Checklist de Deploy - Viagem Colaborativa

## 📋 Pré-Deploy

### 1. Variáveis de Ambiente (Netlify)
Configurar no painel Netlify → Site settings → Environment variables:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### 2. Firebase Console
- ✅ Firestore Rules ativas e permissivas para dev
- ✅ Authentication habilitado (Email/Password)
- ✅ Domínios autorizados (seu-site.netlify.app)

### 3. Build Local
```bash
npm run build
npm run preview  # Testar build localmente
```

## 🚀 Deploy

### Comando Git
```bash
git add .
git commit -m "chore: preparação para deploy com otimizações mobile"
git push origin main
```

### Netlify Auto-Deploy
- Push no `main` dispara build automático
- Build command: `npm run build`
- Publish directory: `dist`

## 🧪 Testes Pós-Deploy

### Mobile (360x640 - Android pequeno)
- [ ] Login funcional
- [ ] Navegação bottom nav responsiva
- [ ] Modais aparecem corretamente
- [ ] Botões têm área de toque adequada (44px+)
- [ ] Sem scroll horizontal
- [ ] Inputs não dão zoom no iOS

### Tablet (768x1024)
- [ ] Layout se adapta
- [ ] Sidebar visível
- [ ] Cards em grid

### Desktop (1920x1080)
- [ ] Max-width dos containers
- [ ] Espaçamento adequado

### Funcionalidades Críticas
- [ ] Criar viagem
- [ ] Adicionar evento
- [ ] Adicionar despesa
- [ ] Logout funcional
- [ ] Adicionar participante por email
- [ ] Editar nome/destino da viagem

### Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] PWA installable

### Offline
- [ ] Service Worker registrado
- [ ] Cache funcionando
- [ ] Firestore persistence ativa

## ⚠️ Problemas Conhecidos Resolvidos

### ✅ CORRIGIDOS
1. ~~Console.logs em produção~~ → Removidos
2. ~~Manifest.json com ícone errado~~ → Corrigido para pwa-192x192.png
3. ~~Arquivos duplicados~~ → AuthContext-v2, TripContext-backup removidos
4. ~~Falta de persistência offline~~ → enableIndexedDbPersistence adicionado
5. ~~Validações fracas~~ → Melhoradas em todos os forms

## 📱 Configurações PWA

### Manifest
- Nome: "Viagem Colaborativa"
- Ícones: 192x192 e 512x512 (PNG)
- Display: standalone
- Theme color: #0EA5E9 (ocean)
- Background: #FAF8F6 (sand)

### Service Worker
- Estratégia: NetworkFirst para Firebase
- Cache: Assets estáticos (js, css, images)
- Runtime caching: Firestore com 24h expiration

## 🔐 Segurança

- ✅ Sem API keys hardcoded
- ✅ HTTPS obrigatório (Netlify)
- ✅ Validação de inputs no cliente e servidor
- ✅ Rules do Firestore configuradas

## 📊 Monitoramento

### Netlify Analytics
- Acessar via Dashboard > Analytics
- Verificar:
  - Page views
  - Build times
  - Error rates

### Firebase Console
- Firestore usage
- Auth users count
- Realtime listeners

## 🚨 Rollback
Se algo quebrar:
```bash
# Ver último commit bom
git log --oneline

# Reverter para commit específico
git revert <commit-hash>
git push origin main
```

## 📞 Suporte
- GitHub Issues: criar issue com logs
- Firebase Console: verificar erros em Firestore
- Netlify Logs: verificar build errors
