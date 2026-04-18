/**
 * ====================================================
 *  STREAMMAX IPTV — INTEGRAÇÃO COM PAINEL ADOC
 *  Gerencia todas as chamadas à API do painel Adoc
 * ====================================================
 *
 *  COMO FUNCIONA:
 *  1. O usuário preenche o formulário de teste
 *  2. O sistema chama a API do painel Adoc para criar
 *     uma conta de teste com duração de 12 horas
 *  3. Os dados de acesso são exibidos na tela e enviados
 *     por WhatsApp ao cliente
 *
 *  DOCUMENTAÇÃO ADOC API:
 *  Endpoint base: {apiUrl}/api/user/create
 *  Autenticação: Basic Auth (username:password)
 * ====================================================
 */

class AdocAPI {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.username = config.username;
    this.password = config.password;
    this.authHeader = 'Basic ' + btoa(`${this.username}:${this.password}`);
  }

  /**
   * Gera um nome de usuário único para conta de teste
   */
  generateUsername(name) {
    const sanitized = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 8);
    const suffix = Math.random().toString(36).substring(2, 6);
    return `test_${sanitized}_${suffix}`;
  }

  /**
   * Gera uma senha aleatória segura
   */
  generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Calcula a data de expiração em formato compatível com Adoc
   */
  getExpiryDate(hours) {
    const now = new Date();
    now.setHours(now.getHours() + hours);
    // Formato: YYYY-MM-DD HH:MM:SS
    return now.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Formata expiração para exibição ao usuário
   */
  formatExpiryForDisplay(hours) {
    const now = new Date();
    now.setHours(now.getHours() + hours);
    return now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Cria conta de teste no painel Adoc
   * Endpoint: GET /api/user/create_trial?key=...
   * Ou via API REST dependendo da versão do Adoc
   */
  async createTrialAccount(name, email, phone, device) {
    const username = this.generateUsername(name);
    const password = this.generatePassword();
    const expiryDate = this.getExpiryDate(IPTVYHWH_CONFIG.adoc.trialHours);
    const expiryDisplay = this.formatExpiryForDisplay(IPTVYHWH_CONFIG.adoc.trialHours);

    // ─── TENTATIVA 1: API REST do Adoc (v2) ───────────────
    try {
      const response = await fetch(`${this.apiUrl}/api/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authHeader,
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          max_connections: IPTVYHWH_CONFIG.adoc.trialConnections,
          package_id: IPTVYHWH_CONFIG.adoc.trialPackageId,
          exp_date: expiryDate,
          is_trial: '1',
          notes: `Teste - ${name} | ${phone} | ${device} | Site IPTV-YHWH`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Adoc] Conta de teste criada:', data);

        return {
          success: true,
          username: username,
          password: password,
          server: this.apiUrl,
          expiry: expiryDisplay,
          raw: data,
        };
      }
    } catch (err) {
      console.warn('[Adoc] API REST falhou, tentando endpoint alternativo...', err);
    }

    // ─── TENTATIVA 2: Endpoint legado do Adoc ─────────────
    try {
      const params = new URLSearchParams({
        username: username,
        password: password,
        max_connections: IPTVYHWH_CONFIG.adoc.trialConnections,
        expiry_date: expiryDate,
        package_id: IPTVYHWH_CONFIG.adoc.trialPackageId,
        member_notes: `Teste - ${name} | ${phone}`,
      });

      const response = await fetch(
        `${this.apiUrl}/api/user/create_sub?${params.toString()}`,
        {
          headers: { 'Authorization': this.authHeader },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          username: username,
          password: password,
          server: this.apiUrl,
          expiry: expiryDisplay,
          raw: data,
        };
      }
    } catch (err) {
      console.warn('[Adoc] Endpoint legado falhou:', err);
    }

    // ─── FALLBACK: Retorno local (para testes sem painel configurado) ──
    console.warn('[Adoc] Painel não configurado ou inacessível. Usando modo demonstração.');
    return {
      success: true,
      demo: true,
      username: username,
      password: password,
      server: this.apiUrl !== 'http://SEU_PAINEL_ADOC.com:25461'
        ? this.apiUrl
        : 'demo.iptv-yhwh.com:8080',
      expiry: expiryDisplay,
    };
  }

  /**
   * Verifica se o painel Adoc está configurado e acessível
   */
  async checkConnection() {
    if (this.apiUrl.includes('SEU_PAINEL')) {
      return { connected: false, reason: 'Painel não configurado' };
    }
    try {
      const response = await fetch(`${this.apiUrl}/api/server_info`, {
        headers: { 'Authorization': this.authHeader },
        signal: AbortSignal.timeout(5000),
      });
      return { connected: response.ok, status: response.status };
    } catch {
      return { connected: false, reason: 'Servidor inacessível' };
    }
  }
}

// Instância global da API Adoc
const adocAPI = new AdocAPI(IPTVYHWH_CONFIG.adoc);
