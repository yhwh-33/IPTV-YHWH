# 🎬 IPTV-YHWH — Site Completo com Integração Adoc

## 📋 Visão Geral
Site de vendas e apresentação de serviço IPTV com integração automática ao painel Adoc. Permite que clientes solicitem teste gratuito (liberado automaticamente via API), visualizem planos e ativem o sinal via WhatsApp.

---

## ✅ Funcionalidades Implementadas

### 🌐 Site Principal (`index.html`)
- **Hero Section** — Banner principal com mockup de TV, estatísticas animadas e chamada para ação
- **Trust Bar** — Barra de benefícios rápidos (segurança, suporte, ativação imediata)
- **Features** — Seção de recursos e diferenciais com cards interativos
- **Canais** — Showcase de categorias + marquee animado com nomes de canais
- **Dispositivos** — Seção de compatibilidade multi-plataforma
- **Planos** — Tabela de preços com toggle mensal/anual e destaque do plano mais vendido
- **Depoimentos** — Cards de clientes satisfeitos
- **FAQ** — Perguntas frequentes com accordion
- **CTA** — Seção de chamada para ação com botão de teste e WhatsApp
- **Contato** — Formulário com redirecionamento para WhatsApp + métodos de contato
- **Footer** — Links, redes sociais e aviso legal

### ⚙️ Funcionalidades Técnicas
- **Navbar responsiva** com menu hamburguer e efeito de scroll
- **Animações** de contadores, scroll e cards
- **Marquee infinita** de canais disponíveis
- **Toggle mensal/anual** nos planos com cálculo automático de preços

### 🔗 Integração com Painel Adoc (`js/adoc.js`)
- Criação automática de conta de teste via API REST do Adoc
- Fallback para endpoint legado do Adoc
- Modo demonstração quando o painel não está configurado
- Geração automática de usuário/senha únicos

### 📱 Modal de Teste Grátis
- Formulário de coleta de dados (nome, e-mail, WhatsApp, dispositivo)
- Integração automática com API Adoc para criar conta de 6 horas
- Exibição dos dados de acesso (servidor, usuário, senha, expiração)
- Botões de cópia dos dados
- Countdown timer de 6 horas
- Envio automático dos dados para o WhatsApp do cliente

### 🟢 Modal de Ativação (WhatsApp)
- Exibe etapas para ativação do sinal
- Quando plano é selecionado, mostra informações do plano
- Link direto para WhatsApp com mensagem pré-preenchida incluindo plano e valor
- Estimativa de tempo de ativação

### 💾 Banco de Dados Local (`tables/leads`)
- Salva automaticamente todos os leads que solicitam teste
- Campos: nome, e-mail, telefone, dispositivo, tipo, status, data

---

## 📁 Estrutura de Arquivos

```
index.html          → Página principal
css/
  style.css         → CSS completo com design premium dark/purple
js/
  config.js         → ⚠️ CONFIGURAÇÕES (edite aqui: número, painel Adoc, planos)
  adoc.js           → Integração com API do painel Adoc
  main.js           → JavaScript principal (UI, modais, animações)
```

---

## ⚙️ Como Configurar

### 1. WhatsApp e Contato (`js/config.js`)
```javascript
company: {
  whatsapp: '5511999998888',  // SEU número com DDI+DDD
  email: 'seuemail@exemplo.com',
}
```

### 2. Painel Adoc (`js/config.js`)
```javascript
adoc: {
  apiUrl: 'http://seupainel.com:25461',  // URL do seu painel
  username: 'admin',                      // Usuário admin
  password: 'sua_senha',                  // Senha admin
  trialHours: 6,                          // Horas do teste grátis
}
```

### 3. Preços dos Planos (`js/config.js`)
```javascript
plans: {
  mensal:      { pricePerMonth: 25, totalPrice: 25,  durationDays: 30  },
  trimestral:  { pricePerMonth: 22, totalPrice: 66,  durationDays: 90  },
  semestral:   { pricePerMonth: 20, totalPrice: 120, durationDays: 180 },
  anual:       { pricePerMonth: 16, totalPrice: 195, durationDays: 365 },
}
```

---

## 🗄️ Modelo de Dados

### Tabela: `leads`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | text | ID único (UUID) |
| name | text | Nome do cliente |
| email | text | E-mail |
| phone | text | WhatsApp |
| device | text | Dispositivo (smart_tv, android, etc) |
| type | text | trial / activation / contact |
| status | text | trial_requested / activated / contact |
| created_at_display | text | Data formatada em pt-BR |

---

## 🔗 Endpoints da API Adoc Utilizados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/user/create` | POST | Criar conta (REST v2) |
| `/api/user/create_sub` | GET | Criar conta (endpoint legado) |
| `/api/server_info` | GET | Verificar conexão |

---

## 📌 URIs Funcionais

| Path | Descrição |
|------|-----------|
| `/` → `index.html` | Página principal |
| `/#home` | Seção hero |
| `/#features` | Recursos |
| `/#channels` | Canais |
| `/#plans` | Planos e preços |
| `/#faq` | FAQ |
| `/#contact` | Contato |
| `tables/leads` | API de leads (GET/POST) |

---

## 🚧 Funcionalidades Não Implementadas / Próximos Passos

- [ ] **Painel do cliente** — área para o cliente ver status da conta
- [ ] **Integração com Mercado Pago/PicPay** — pagamento automático com liberação instantânea
- [ ] **Webhook do Adoc** — receber notificações de expiração automáticas
- [ ] **Dashboard Admin** — visualizar leads e clientes ativos
- [ ] **E-mail automático** — confirmação de teste por e-mail (SMTP)
- [ ] **Integração com Stripe/PagSeguro** — para clientes internacionais
- [ ] **Blog** — conteúdo SEO para atrair tráfego orgânico
- [ ] **Página de configuração** — tutoriais de instalação por dispositivo

---

## 🎨 Design

- **Paleta**: Dark (#0a0a0f) + Roxo (#7c3aed) + Rosa (#ec4899) + Ciano (#06b6d4)
- **Fontes**: Inter (corpo) + Orbitron (títulos/números)
- **Ícones**: Font Awesome 6
- **Animações**: Animate.css + CSS personalizado
- **Design responsivo**: Mobile, tablet e desktop

---

## 🚀 Deploy

Para publicar o site, acesse a **aba Publish** e clique em publicar. O site ficará disponível com URL pública.

---

*IPTV-YHWH — Site criado em 2026*
