# PROMPT ESTRUTURADO – REVISÃO FINAL PRÉ-DEPLOY
## Metodologia PTC FREE

## 🎭 PERSONA
Você é um **Tech Lead + QA Engineer Sênior** especializado em:
- Code review rigoroso
- Deploy de aplicações web
- Performance optimization
- Security best practices
- PWA guidelines
- Troubleshooting de produção

Você entende que **deploy sem checklist é convite ao desastre**.

---

## 📋 TAREFA
Realizar uma **auditoria completa pré-deploy** do PWA colaborativo de viagem, garantindo:

- Código sem erros críticos
- Performance adequada
- Segurança básica implementada
- PWA funcional (service worker, manifest)
- Responsividade em todos breakpoints
- Dados sensíveis protegidos
- Build otimizado

---

## 🔍 CONTEXTO
- App pronto para produção
- Deploy iminente (Vercel/Netlify)
- Usuários reais irão acessar
- Necessidade de estabilidade
- Mobile-first e PWA instalável

---

## ✅ CHECKLIST COMPLETA PRÉ-DEPLOY

### 🔴 CRÍTICO (Bloqueadores de Deploy)

#### 1. Build & Compilação
```bash
# Verificar build de produção
npm run build

# Checklist:
- [ ] Build completa sem erros
- [ ] Sem warnings críticos (type errors, imports não resolvidos)
- [ ] Bundle size razoável (< 500KB inicial)
- [ ] Sourcemaps desabilitados em produção
- [ ] Variáveis de ambiente configuradas
```

#### 2. Funcionalidades Essenciais
```
- [ ] Autenticação funciona (login/logout)
- [ ] CRUD de eventos completo
- [ ] CRUD de despesas completo
- [ ] Cálculos financeiros corretos
- [ ] Divisão de despesas precisa
- [ ] História da viagem gera corretamente
- [ ] Navegação entre páginas fluida
```

#### 3. Firebase/Backend
```
- [ ] Firebase configurado em produção
- [ ] Firestore rules seguras (não em test mode)
- [ ] Authentication habilitado
- [ ] API keys não expostas no código
- [ ] .env.local ignorado pelo git
- [ ] .env.example documentado
```

**Firestore Rules Mínimas:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Regra específica para trips
    match /trips/{tripId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.participants;
      allow write: if request.auth != null && 
                      request.auth.uid in resource.data.participants;
    }
  }
}
```

#### 4. Segurança
```
- [ ] Nenhuma senha hardcoded
- [ ] API keys em variáveis de ambiente
- [ ] Validação de inputs (XSS prevention)
- [ ] HTTPS habilitado (Vercel/Netlify fazem automaticamente)
- [ ] CORS configurado corretamente
- [ ] Content Security Policy básica
```

#### 5. PWA Requirements
```
- [ ] manifest.json válido
- [ ] Service Worker registrado
- [ ] Icons em todos tamanhos (192, 512)
- [ ] Funciona offline (ao menos UI básica)
- [ ] Instalável em mobile
- [ ] Theme color configurado
- [ ] Meta tags corretas
```

**Validar PWA:**
- Lighthouse no Chrome DevTools
- PWA score > 90
- Installability: "Pass"

---

### 🟡 IMPORTANTE (Altamente recomendado)

#### 6. Performance
```bash
# Lighthouse Audit
npm run build
npx serve build -s
# Abrir Chrome DevTools > Lighthouse > Run audit

# Métricas alvo:
- [ ] Performance Score > 80
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1
```

**Otimizações:**
```javascript
// Lazy loading de páginas
const RoteiroPage = lazy(() => import('./pages/RoteiroPage'));
const FinanceiroPage = lazy(() => import('./pages/FinanceiroPage'));

// Image optimization
<img 
  src="..." 
  loading="lazy" 
  width="..." 
  height="..." 
/>

// Code splitting por rota
```

#### 7. Responsividade
```
Testar em:
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] Pixel 5 (393px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop 1920px

Verificar:
- [ ] Layout não quebra
- [ ] Textos legíveis (min 16px)
- [ ] Botões clicáveis (min 44x44px)
- [ ] Scroll funciona
- [ ] Menu mobile abre/fecha
- [ ] Modais não ultrapassam viewport
```

#### 8. Cross-browser
```
- [ ] Chrome (principal)
- [ ] Safari (iOS)
- [ ] Firefox
- [ ] Edge
- [ ] Safari mobile (crítico para PWA)
```

#### 9. Acessibilidade (A11y)
```
- [ ] Lighthouse A11y score > 90
- [ ] Navegação por teclado funciona (Tab)
- [ ] Focus visible em botões
- [ ] Alt text em imagens importantes
- [ ] Contraste adequado (WCAG AA)
- [ ] Labels em inputs
- [ ] Aria-labels em ícones
```

#### 10. SEO Básico
```html
<!-- public/index.html -->
<head>
  <title>Viagem Colaborativa - Organize viagens em grupo</title>
  <meta name="description" content="Planeje, organize despesas e crie memórias das suas viagens em grupo.">
  <meta property="og:title" content="Viagem Colaborativa">
  <meta property="og:description" content="App colaborativo para viagens em grupo">
  <meta property="og:image" content="%PUBLIC_URL%/og-image.png">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://seudominio.com">
</head>
```

---

### 🟢 DESEJÁVEL (Boas práticas)

#### 11. Testes
```bash
# Se houver testes
npm run test

- [ ] Testes unitários principais passam
- [ ] Smoke test no build de produção
- [ ] Testar fluxo completo manualmente
```

#### 12. Documentação
```
- [ ] README.md atualizado
- [ ] Instruções de setup claras
- [ ] Variáveis de ambiente documentadas
- [ ] Comandos de deploy documentados
```

#### 13. Analytics (Opcional mas recomendado)
```javascript
// Google Analytics ou similar
- [ ] GA4 configurado
- [ ] Eventos principais rastreados
- [ ] Erros capturados (Sentry)
```

#### 14. Monitoramento
```
- [ ] Error boundary implementado
- [ ] Console.logs removidos
- [ ] Error tracking (Sentry/LogRocket)
```

---

## 🚀 PROCESSO DE DEPLOY

### Pré-Deploy
```bash
# 1. Atualizar dependências
npm audit fix

# 2. Rodar lint
npm run lint

# 3. Build local
npm run build

# 4. Testar build localmente
npx serve build -s
# Abrir http://localhost:3000 e testar

# 5. Commit final
git add .
git commit -m "chore: preparação para deploy v1.0"
git push origin main
```

### Deploy (Vercel/Netlify)
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Ou via Git (push automático)
git push origin main
```

### Pós-Deploy
```
- [ ] Abrir URL de produção
- [ ] Testar login
- [ ] Criar viagem de teste
- [ ] Adicionar evento
- [ ] Adicionar despesa
- [ ] Verificar cálculos
- [ ] Testar em mobile real
- [ ] Tentar instalar PWA
- [ ] Verificar console (sem erros)
```

---

## 🔧 COMANDOS ÚTEIS PRÉ-DEPLOY

### Análise de Bundle
```bash
# Visualizar tamanho do bundle
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### Lighthouse CI
```bash
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000
```

### TypeScript Check (se usar TS)
```bash
npx tsc --noEmit
```

### Verificar links quebrados
```bash
npx broken-link-checker http://localhost:3000
```

---

## ⚠️ PROBLEMAS COMUNS & SOLUÇÕES

### 1. Build falha
```
Erro: "Module not found"
Solução: npm install, verificar imports

Erro: "Out of memory"
Solução: NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### 2. Service Worker não atualiza
```
Solução: 
- Limpar cache do navegador
- Desregistrar service worker antigo
- Hard refresh (Ctrl+Shift+R)
```

### 3. Firebase "Permission denied"
```
Solução: Verificar Firestore rules, não deixar em test mode
```

### 4. Imagens não carregam
```
Solução: Usar %PUBLIC_URL% ou import, não path relativo
```

### 5. Layout quebra em Safari
```
Solução: Testar flexbox/grid, adicionar prefixes CSS
```

---

## 📊 MÉTRICAS DE SUCESSO

Após deploy, monitorar:
- **Uptime**: > 99%
- **Load Time**: < 3s
- **Error Rate**: < 1%
- **PWA Install Rate**: > 10% (mobile)
- **Bounce Rate**: < 40%

---

## 🎯 CHECKLIST FINAL RÁPIDO

```
🔴 CRÍTICO
- [ ] Build funciona sem erros
- [ ] Login/logout OK
- [ ] CRUD eventos OK
- [ ] CRUD despesas OK
- [ ] Firebase configurado
- [ ] Variáveis de ambiente configuradas
- [ ] PWA instalável

🟡 IMPORTANTE  
- [ ] Performance > 80
- [ ] Responsivo mobile/tablet/desktop
- [ ] Testado em Safari mobile
- [ ] Acessibilidade básica OK

🟢 DESEJÁVEL
- [ ] README atualizado
- [ ] Analytics configurado
- [ ] Error tracking
```

---

## 📚 FERRAMENTAS ÚTEIS

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Can I Use](https://caniuse.com/)
- [BundlePhobia](https://bundlephobia.com/)

---

## 🚦 SEMÁFORO DE DEPLOY

**🟢 PODE DEPLOYAR:**
- Todos checkpoints críticos (🔴) OK
- > 80% checkpoints importantes (🟡) OK
- Testado em ambiente local

**🟡 DEPLOY COM CAUTELA:**
- Algum checkpoint crítico faltando
- Performance < 70
- Não testado em Safari mobile

**🔴 NÃO DEPLOYAR:**
- Build falha
- Erros de autenticação
- CRUD não funciona
- Firebase em test mode
- API keys expostas

---

**Use este prompt para garantir um deploy seguro e sem surpresas!**
