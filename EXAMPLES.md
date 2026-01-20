# 📚 EXEMPLOS DE DADOS E USO

## 🔥 Estrutura de Dados no Firestore

### Exemplo Completo de Viagem

```javascript
// Documento em: trips/{tripId}
{
  name: "Viagem para Paris - Junho 2026",
  participants: [
    "user123abc",  // João
    "user456def",  // Maria
    "user789ghi"   // Pedro
  ],
  createdBy: "user123abc",
  createdAt: Timestamp(2026-01-20),
  description: "Viagem dos sonhos para conhecer Paris"
}
```

### Exemplos de Eventos

```javascript
// Subcoleção: trips/{tripId}/events/{eventId}

// Evento 1: Voo de ida
{
  type: "voo",
  title: "Voo GRU → CDG",
  description: "Air France AF123 - Classe Econômica",
  date: Timestamp(2026-06-15 14:30),
  location: "Aeroporto de Guarulhos, São Paulo",
  createdBy: "user123abc",
  createdAt: Timestamp(2026-01-20)
}

// Evento 2: Transfer
{
  type: "transfer",
  title: "Transfer Aeroporto → Hotel",
  description: "Uber reservado com antecedência",
  date: Timestamp(2026-06-15 22:00),
  location: "Charles de Gaulle → Le Marais",
  createdBy: "user456def",
  createdAt: Timestamp(2026-01-20)
}

// Evento 3: Hospedagem
{
  type: "hospedagem",
  title: "Hotel Le Petit Paris",
  description: "Hotel boutique no coração de Le Marais. Quarto triplo com café da manhã incluído.",
  date: Timestamp(2026-06-15 23:00),
  location: "15 Rue de Rivoli, Le Marais, Paris",
  createdBy: "user123abc",
  createdAt: Timestamp(2026-01-20)
}

// Evento 4: Passeio
{
  type: "passeio",
  title: "Torre Eiffel",
  description: "Visita ao topo da Torre Eiffel ao pôr do sol. Ingressos já comprados!",
  date: Timestamp(2026-06-16 18:00),
  location: "Champ de Mars, Paris",
  createdBy: "user789ghi",
  createdAt: Timestamp(2026-01-21)
}

// Evento 5: Alimentação
{
  type: "alimentacao",
  title: "Jantar no Le Jules Verne",
  description: "Restaurante michelin no segundo andar da Torre Eiffel",
  date: Timestamp(2026-06-16 20:30),
  location: "Torre Eiffel, 2º andar",
  createdBy: "user456def",
  createdAt: Timestamp(2026-01-21)
}

// Evento 6: Mais passeios
{
  type: "passeio",
  title: "Museu do Louvre",
  description: "Tour guiado pelas obras principais. Mona Lisa, Vênus de Milo, etc.",
  date: Timestamp(2026-06-17 10:00),
  location: "Musée du Louvre, Paris",
  createdBy: "user123abc",
  createdAt: Timestamp(2026-01-22)
}

// Evento 7: Voo de volta
{
  type: "voo",
  title: "Voo CDG → GRU",
  description: "Air France AF124 - Retorno ao Brasil",
  date: Timestamp(2026-06-20 16:00),
  location: "Aeroporto Charles de Gaulle",
  createdBy: "user123abc",
  createdAt: Timestamp(2026-01-20)
}
```

### Exemplos de Despesas

```javascript
// Subcoleção: trips/{tripId}/expenses/{expenseId}

// Despesa 1: Passagens aéreas
{
  category: "aereo",
  description: "Passagens aéreas São Paulo ↔ Paris (3 pessoas)",
  amount: 9000.00,
  paidBy: "user123abc",  // João pagou
  splitBetween: ["user123abc", "user456def", "user789ghi"],  // Divide entre todos
  date: Timestamp(2026-01-15),
  createdBy: "user123abc",
  createdAt: Timestamp(2026-01-15)
}
// Cada um deve: R$ 3.000,00

// Despesa 2: Hotel
{
  category: "hospedagem",
  description: "Hotel Le Petit Paris - 5 noites",
  amount: 3600.00,
  paidBy: "user456def",  // Maria pagou
  splitBetween: ["user123abc", "user456def", "user789ghi"],
  date: Timestamp(2026-01-18),
  createdBy: "user456def",
  createdAt: Timestamp(2026-01-18)
}
// Cada um deve: R$ 1.200,00

// Despesa 3: Transfer
{
  category: "transfer",
  description: "Uber Aeroporto → Hotel",
  amount: 120.00,
  paidBy: "user789ghi",  // Pedro pagou
  splitBetween: ["user123abc", "user456def", "user789ghi"],
  date: Timestamp(2026-06-15),
  createdBy: "user789ghi",
  createdAt: Timestamp(2026-06-15)
}
// Cada um deve: R$ 40,00

// Despesa 4: Ingressos
{
  category: "passeios",
  description: "Ingressos Torre Eiffel (3 pessoas)",
  amount: 450.00,
  paidBy: "user123abc",  // João pagou
  splitBetween: ["user123abc", "user456def", "user789ghi"],
  date: Timestamp(2026-02-10),
  createdBy: "user123abc",
  createdAt: Timestamp(2026-02-10)
}
// Cada um deve: R$ 150,00

// Despesa 5: Jantar
{
  category: "alimentacao",
  description: "Jantar no Le Jules Verne",
  amount: 900.00,
  paidBy: "user456def",  // Maria pagou
  splitBetween: ["user123abc", "user456def", "user789ghi"],
  date: Timestamp(2026-06-16),
  createdBy: "user456def",
  createdAt: Timestamp(2026-06-16)
}
// Cada um deve: R$ 300,00

// Despesa 6: Museu
{
  category: "passeios",
  description: "Tour guiado Museu do Louvre",
  amount: 600.00,
  paidBy: "user789ghi",  // Pedro pagou
  splitBetween: ["user123abc", "user456def", "user789ghi"],
  date: Timestamp(2026-06-17),
  createdBy: "user789ghi",
  createdAt: Timestamp(2026-06-17)
}
// Cada um deve: R$ 200,00

// Despesa 7: Alimentação (só 2 pessoas)
{
  category: "alimentacao",
  description: "Café da manhã em padaria local",
  amount: 150.00,
  paidBy: "user123abc",  // João pagou
  splitBetween: ["user123abc", "user456def"],  // Só João e Maria
  date: Timestamp(2026-06-18),
  createdBy: "user123abc",
  createdAt: Timestamp(2026-06-18)
}
// João e Maria devem: R$ 75,00 cada

// Despesa 8: Souvenirs
{
  category: "outros",
  description: "Lembrancinhas e souvenirs",
  amount: 300.00,
  paidBy: "user456def",  // Maria pagou
  splitBetween: ["user456def"],  // Só ela
  date: Timestamp(2026-06-19),
  createdBy: "user456def",
  createdAt: Timestamp(2026-06-19)
}
// Só Maria paga: R$ 300,00
```

## 📊 Cálculos do Exemplo

### Total da Viagem
```
R$ 9.000,00 (aéreo)
+ R$ 3.600,00 (hospedagem)
+ R$ 120,00 (transfer)
+ R$ 450,00 (passeios)
+ R$ 900,00 (alimentação)
+ R$ 600,00 (passeios)
+ R$ 150,00 (alimentação)
+ R$ 300,00 (outros)
= R$ 15.120,00
```

### Quanto cada um pagou
```javascript
João (user123abc):
  R$ 9.000,00 (passagens)
  + R$ 450,00 (Torre Eiffel)
  + R$ 150,00 (café)
  = R$ 9.600,00

Maria (user456def):
  R$ 3.600,00 (hotel)
  + R$ 900,00 (jantar)
  + R$ 300,00 (souvenirs)
  = R$ 4.800,00

Pedro (user789ghi):
  R$ 120,00 (uber)
  + R$ 600,00 (Louvre)
  = R$ 720,00
```

### Quanto cada um deveria pagar
```javascript
João:
  R$ 3.000 (passagens ÷ 3)
  + R$ 1.200 (hotel ÷ 3)
  + R$ 40 (uber ÷ 3)
  + R$ 150 (Torre ÷ 3)
  + R$ 300 (jantar ÷ 3)
  + R$ 200 (Louvre ÷ 3)
  + R$ 75 (café ÷ 2)
  = R$ 4.965,00

Maria:
  R$ 3.000 + R$ 1.200 + R$ 40 + R$ 150 + R$ 300 + R$ 200 + R$ 75 + R$ 300 (souvenirs)
  = R$ 5.265,00

Pedro:
  R$ 3.000 + R$ 1.200 + R$ 40 + R$ 150 + R$ 300 + R$ 200
  = R$ 4.890,00
```

### Balanço Final
```javascript
João:
  Pagou: R$ 9.600,00
  Deveria pagar: R$ 4.965,00
  Balanço: +R$ 4.635,00 ✅ (Deve receber)

Maria:
  Pagou: R$ 4.800,00
  Deveria pagar: R$ 5.265,00
  Balanço: -R$ 465,00 ⚠️ (Deve pagar)

Pedro:
  Pagou: R$ 720,00
  Deveria pagar: R$ 4.890,00
  Balanço: -R$ 4.170,00 ⚠️ (Deve pagar)
```

**Acertos:**
- Maria deve R$ 465,00 para João
- Pedro deve R$ 4.170,00 para João
- Total que João recebe: R$ 4.635,00 ✅

## 📖 Exemplo de História Gerada

```markdown
# Viagem para Paris - Junho 2026

## Uma Aventura de 6 Dias

Entre 15 de junho de 2026 e 20 de junho de 2026, embarcamos em uma jornada memorável com 3 pessoas. Esta é a história de como criamos memórias que vão durar para sempre.

## 🗺️ Nosso Roteiro

### Voando Alto

Nossa aventura começou com 2 voos, levando-nos através dos céus rumo ao destino dos nossos sonhos. Voo GRU → CDG em Aeroporto de Guarulhos, São Paulo. Voo CDG → GRU em Aeroporto Charles de Gaulle.

### Onde Ficamos

Encontramos nosso lar longe de casa em Hotel Le Petit Paris (15 Rue de Rivoli, Le Marais, Paris). Hotel boutique no coração de Le Marais. Quarto triplo com café da manhã incluído. Foi o lugar perfeito para descansar entre as aventuras.

### Explorando o Destino

Vivemos 2 experiências incríveis:

- **Torre Eiffel** - 16 de junho: Visita ao topo da Torre Eiffel ao pôr do sol. Ingressos já comprados!
- **Museu do Louvre** - 17 de junho: Tour guiado pelas obras principais. Mona Lisa, Vênus de Milo, etc.

### Sabores da Viagem

A gastronomia foi parte essencial da nossa experiência. Descobrimos 2 lugares especiais para saborear a culinária local, desde refeições simples até experiências gastronômicas memoráveis.

## 💰 Investimento na Experiência

Para tornar essa viagem realidade, investimos um total de **R$ 15.120,00**. Ao longo de 8 transações, gerenciamos cuidadosamente nossos recursos para aproveitar ao máximo cada momento.

### Distribuição dos Gastos

- **passagens aéreas**: R$ 9.000,00 (59.5%)
- **hospedagem**: R$ 3.600,00 (23.8%)
- **alimentação**: R$ 1.050,00 (6.9%)
- **passeios**: R$ 1.050,00 (6.9%)
- **outros gastos**: R$ 300,00 (2.0%)
- **transfers**: R$ 120,00 (0.8%)

Dividindo igualmente, cada participante contribuiu com aproximadamente **R$ 5.040,00** para fazer essa experiência acontecer.

## ✨ Reflexões Finais

Esta viagem foi mais do que destinos visitados ou dinheiro gasto. Foi sobre os momentos compartilhados, as risadas, as descobertas e as conexões criadas. Cada experiência, desde os voos até as refeições, contribuiu para uma jornada que ficará gravada em nossas memórias.

Obrigado por fazer parte desta aventura. Que venham muitas outras!

---

*História gerada automaticamente em 20 de janeiro de 2026*
```

## 🔧 Como Testar com Dados Reais

### Script para popular dados (opcional)

Você pode adicionar este arquivo para popular dados de teste:

```javascript
// src/utils/seedData.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const seedTripData = async (tripId, userId) => {
  // Adiciona eventos
  const events = [
    {
      type: "voo",
      title: "Voo GRU → CDG",
      description: "Air France AF123",
      date: new Date('2026-06-15T14:30'),
      location: "Aeroporto de Guarulhos",
      createdBy: userId,
      createdAt: serverTimestamp()
    },
    // ... adicione mais eventos aqui
  ];

  const expenses = [
    {
      category: "aereo",
      description: "Passagens aéreas",
      amount: 9000,
      paidBy: userId,
      splitBetween: [userId],
      date: new Date(),
      createdBy: userId,
      createdAt: serverTimestamp()
    },
    // ... adicione mais despesas aqui
  ];

  // Adiciona no Firestore
  for (const event of events) {
    await addDoc(collection(db, 'trips', tripId, 'events'), event);
  }

  for (const expense of expenses) {
    await addDoc(collection(db, 'trips', tripId, 'expenses'), expense);
  }
};
```

---

💡 **Dica:** Use estes exemplos como referência para criar suas próprias viagens!
