/**
 * ====================================================
 *  STREAMMAX IPTV — CONFIGURAÇÕES PRINCIPAIS
 *  Edite as informações abaixo conforme seu painel Adoc
 * ====================================================
 */

const IPTVYHWH_CONFIG = {

  // ─── INFORMAÇÕES DA EMPRESA ─────────────────────────
  company: {
    name: 'IPTV-YHWH',
    whatsapp: '5577991081161',   // ← ALTERE: número com DDI+DDD (ex: 5511999998888)
    email: '',
    telegram: '',
    instagram: 'https://wa.me/5577991081161',
    facebook: 'https://wa.me/5577991081161',
  },

  // ─── INTEGRAÇÃO COM PAINEL ADOC ─────────────────────
  // Preencha com os dados do seu painel Adoc
  adoc: {
    // URL base da API do seu painel Adoc (sem barra no final)
    // Exemplos:
    //   'http://seupainel.com:25461'
    //   'https://painel.seusite.com.br'
    apiUrl: 'http://SEU_PAINEL_ADOC.com:25461',

    // Usuário administrador do painel Adoc
    username: 'admin',

    // Senha do usuário administrador
    password: 'SUA_SENHA_AQUI',

    // Duração do teste em horas
    trialHours: 12,

    // Pacote padrão para contas de teste (ID do pacote no painel)
    trialPackageId: 1,

    // Número máximo de conexões no teste
    trialConnections: 1,
  },

  // ─── PLANOS (por período de contratação) ────────────
  // Todos os planos têm acesso completo: mesmos canais,
  // mesma qualidade, mesmos recursos. A diferença é
  // apenas a duração e o preço por mês (quanto maior o
  // período, maior a economia).
  plans: {
    mensal: {
      id: 'mensal',
      name: 'Mensal',
      pricePerMonth: 25,      // R$/mês cobrado
      totalPrice: 25,         // total pago de uma vez
      durationDays: 30,       // dias de acesso
      economy: 0,             // economia vs mensal
      whatsappMessage:
        '📺 Olá! Quero assinar o *Plano Mensal* do IPTV-YHWH.\n\n' +
        '📅 Duração: *30 dias*\n' +
        '💰 Valor: *R$ 25,00*\n\n' +
        'Segue meu comprovante de pagamento! 😊',
    },
    trimestral: {
      id: 'trimestral',
      name: 'Trimestral',
      pricePerMonth: 22,
      totalPrice: 66,
      durationDays: 90,
      economy: 9,
      whatsappMessage:
        '📺 Olá! Quero assinar o *Plano Trimestral* do IPTV-YHWH.\n\n' +
        '📅 Duração: *90 dias*\n' +
        '💰 Total: *R$ 66,00* (R$ 22/mês)\n' +
        '💚 Economia: *R$ 9,00*\n\n' +
        'Segue meu comprovante de pagamento! 😊',
    },
    semestral: {
      id: 'semestral',
      name: 'Semestral',
      pricePerMonth: 20,
      totalPrice: 120,
      durationDays: 180,
      economy: 30,
      whatsappMessage:
        '📺 Olá! Quero assinar o *Plano Semestral* do IPTV-YHWH.\n\n' +
        '📅 Duração: *180 dias*\n' +
        '💰 Total: *R$ 120,00* (R$ 20/mês)\n' +
        '💚 Economia: *R$ 30,00*\n\n' +
        'Segue meu comprovante de pagamento! 😊',
    },
    anual: {
      id: 'anual',
      name: 'Anual',
      pricePerMonth: 16,
      totalPrice: 195,
      durationDays: 365,
      economy: 105,
      whatsappMessage:
        '📺 Olá! Quero assinar o *Plano Anual* do IPTV-YHWH.\n\n' +
        '📅 Duração: *365 dias*\n' +
        '💰 Total: *R$ 195,00* (R$ 16/mês)\n' +
        '💚 Economia: *R$ 105,00*\n\n' +
        'Segue meu comprovante de pagamento! 😊',
    },
  },

  // ─── MENSAGENS WHATSAPP ──────────────────────────────
  messages: {
    trial: (name, user, pass, server) =>
      `Olá *${name}*! 🎉\n\n` +
      `Seu teste IPTV-YHWH está ativo por *12 horas*!\n\n` +
      `📺 *Dados de Acesso:*\n` +
      `🔗 Servidor: ${server}\n` +
      `👤 Usuário: *${user}*\n` +
      `🔐 Senha: *${pass}*\n\n` +
      `Precisando de ajuda para configurar, é só chamar! 😊`,

    activation: (planName, priceMonth, days, total) =>
      `Olá! Quero ativar meu sinal IPTV-YHWH.\n\n` +
      `📦 Plano: *${planName}*\n` +
      `📅 Duração: *${days} dias*\n` +
      `💰 Total: *R$ ${total}*\n\n` +
      `Segue o comprovante de pagamento:`,

    support: `Olá! Preciso de suporte com meu IPTV-YHWH.`,
    contact: (name, phone, message) =>
      `📩 *Nova mensagem do site*\n\n` +
      `👤 Nome: ${name}\n` +
      `📱 WhatsApp: ${phone}\n` +
      `💬 Mensagem: ${message}`,
  },
};
