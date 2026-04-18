/**
 * ====================================================
 *  STREAMMAX IPTV — JAVASCRIPT PRINCIPAL
 *  Interface, animações e fluxo de usuário
 * ====================================================
 */

// ─── ESTADO GLOBAL ──────────────────────────────────
let selectedPlan = null;
let countdownInterval = null;
let countdownSeconds = 0;

// ─── INICIALIZAÇÃO ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounterAnimation();
  initWhatsappLinks();
  updateWhatsappLinks(IPTVYHWH_CONFIG.company.whatsapp);
  console.log('%c🎬 IPTV-YHWH carregado!', 'color: #7c3aed; font-size: 16px; font-weight: bold;');
});

// ─── NAVBAR ─────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ─── COUNTER ANIMATION ───────────────────────────────
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString('pt-BR');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
    }
  }, 16);
}

// ─── SCROLL ANIMATIONS ───────────────────────────────
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar tudo imediatamente
    document.querySelectorAll('.feature-card, .plan-card, .cat-card, .testimonial-card, .faq-item').forEach(el => {
      el.style.opacity = '1';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  // Observe cards
  document.querySelectorAll('.feature-card, .plan-card, .cat-card, .testimonial-card, .faq-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
    observer.observe(el);
  });
}

// ─── WHATSAPP LINKS ──────────────────────────────────
function initWhatsappLinks() {
  // Aplicar número ao botão flutuante e demais links
}

function updateWhatsappLinks(number) {
  const baseUrl = `https://wa.me/${number}`;

  // Botão flutuante
  const floatBtn = document.querySelector('.whatsapp-float');
  if (floatBtn) floatBtn.href = baseUrl;

  // CTA de contato
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    const originalHref = link.getAttribute('href');
    if (originalHref && originalHref.includes('wa.me/5500000000000')) {
      link.href = originalHref.replace('5500000000000', number);
    }
  });
}

// ─── SCROLL TO PLANS ─────────────────────────────────
function scrollToPlans() {
  document.getElementById('plans').scrollIntoView({ behavior: 'smooth' });
}

// ─── SELECIONAR PLANO E ABRIR ATIVAÇÃO ───────────────
// planId: 'mensal'|'trimestral'|'semestral'|'anual'
// priceMonth: preço mensal   days: duração em dias   total: valor total
function selectPlan(planId, planName, priceMonth, days, total) {
  selectedPlan = { id: planId, name: planName, priceMonth, days, total };
  openActivationModal(planId, planName, priceMonth, days, total);
}

// ─── FAQ ─────────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isActive = item.classList.contains('active');

  // Fechar todos
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('active');
    i.querySelector('.faq-answer').style.maxHeight = '0';
  });

  // Abrir o clicado (se não estava aberto)
  if (!isActive) {
    item.classList.add('active');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

// ─── MODAL: TESTE GRÁTIS ─────────────────────────────
function openTestModal() {
  const modal = document.getElementById('testModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Resetar formulário
  document.getElementById('testForm').style.display = '';
  document.getElementById('testResult').style.display = 'none';
  document.getElementById('testForm').reset();
}

function closeTestModal() {
  document.getElementById('testModal').classList.remove('active');
  document.body.style.overflow = '';
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

// Fechar modal ao clicar fora
document.getElementById('testModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeTestModal();
});

// ─── SUBMISSÃO DO FORMULÁRIO DE TESTE ────────────────
async function submitTestRequest(e) {
  e.preventDefault();

  const name    = document.getElementById('testName').value.trim();
  const email   = document.getElementById('testEmail').value.trim();
  const phone   = document.getElementById('testPhone').value.trim();
  const device  = document.getElementById('testDevice').value;

  const submitBtn = document.getElementById('testSubmitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Gerando acesso...';

  try {
    // Salvar lead no banco local
    await saveLeadToDatabase({ name, email, phone, device, type: 'trial' });

    // Criar conta de teste no painel Adoc
    const result = await adocAPI.createTrialAccount(name, email, phone, device);

    if (result.success) {
      showTestResult(result, name, phone);
      sendWhatsappNotification(name, phone, result);
    } else {
      throw new Error('Falha ao criar conta no painel');
    }
  } catch (error) {
    console.error('[Teste] Erro:', error);

    // Mesmo com erro, mostramos dados de demonstração e encaminhamos ao WhatsApp
    showToast('Redirecionando para atendimento via WhatsApp...', 'warning');
    setTimeout(() => {
      closeTestModal();
      const msg = encodeURIComponent(
        `Olá! Quero solicitar meu teste grátis do IPTV-YHWH.\n\n` +
        `Nome: ${name}\nE-mail: ${email}\nDispositivo: ${device}`
      );
      window.open(`https://wa.me/${IPTVYHWH_CONFIG.company.whatsapp}?text=${msg}`, '_blank');
    }, 1500);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-play"></i> Gerar Teste Grátis';
  }
}

// ─── EXIBIR RESULTADO DO TESTE ───────────────────────
function showTestResult(result, name, phone) {
  // Esconder formulário, mostrar resultado
  document.getElementById('testForm').style.display = 'none';

  const resultEl = document.getElementById('testResult');
  resultEl.style.display = 'block';

  // Preencher dados
  document.getElementById('resultServer').textContent = result.server;
  document.getElementById('resultUser').textContent   = result.username;
  document.getElementById('resultPass').textContent   = result.password;
  document.getElementById('resultExpiry').textContent = result.expiry;

  // Iniciar contagem regressiva de 12 horas
  startCountdown(IPTVYHWH_CONFIG.adoc.trialHours * 3600);

  showToast('✅ Teste gerado com sucesso!');
}

// ─── COUNTDOWN TIMER ─────────────────────────────────
function startCountdown(seconds) {
  countdownSeconds = seconds;
  const display = document.getElementById('countdown');

  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    countdownSeconds--;
    if (countdownSeconds <= 0) {
      clearInterval(countdownInterval);
      display.textContent = '00:00:00';
      display.style.color = '#ef4444';
      return;
    }

    const h = Math.floor(countdownSeconds / 3600);
    const m = Math.floor((countdownSeconds % 3600) / 60);
    const s = countdownSeconds % 60;
    display.textContent =
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, 1000);
}

// ─── ENVIAR NOTIFICAÇÃO POR WHATSAPP ─────────────────
function sendWhatsappNotification(name, phone, result) {
  const rawPhone = phone.replace(/\D/g, '');
  const ddi = rawPhone.startsWith('55') ? '' : '55';
  const fullPhone = ddi + rawPhone;

  const message = IPTVYHWH_CONFIG.messages.trial(
    name,
    result.username,
    result.password,
    result.server
  );

  // Abrir WhatsApp em aba separada para enviar os dados ao cliente
  const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
  setTimeout(() => window.open(url, '_blank'), 1000);
}

// ─── FECHAR TESTE E ABRIR WHATSAPP ───────────────────
function closeTestAndOpenWhatsapp() {
  closeTestModal();
  const msg = encodeURIComponent(IPTVYHWH_CONFIG.messages.support);
  window.open(`https://wa.me/${IPTVYHWH_CONFIG.company.whatsapp}?text=${msg}`, '_blank');
}

// ─── COPIAR TEXTO ────────────────────────────────────
function copyText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  navigator.clipboard.writeText(el.textContent)
    .then(() => showToast('Copiado para a área de transferência!'))
    .catch(() => {
      // Fallback para navegadores mais antigos
      const tmp = document.createElement('input');
      tmp.value = el.textContent;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
      showToast('Copiado!');
    });
}

// ─── MODAL: ATIVAÇÃO ─────────────────────────────────
function openActivationModal(planId, planName, priceMonth, days, total) {
  const modal = document.getElementById('activationModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const planInfoBox = document.getElementById('activationPlanInfo');
  const wppBtn      = document.getElementById('activationWhatsappBtn');

  if (planId && planName) {
    // Busca config do plano pelo id
    const planConfig = IPTVYHWH_CONFIG.plans[planId];

    // Preenche campos do modal
    document.getElementById('activationPlanName').textContent  = planName;
    document.getElementById('activationPlanPrice').textContent = `R$ ${priceMonth || planConfig?.pricePerMonth || '—'}`;
    document.getElementById('activationPlanDays').textContent  = days || planConfig?.durationDays || '—';

    const totalVal = total || planConfig?.totalPrice || '—';
    document.getElementById('activationPlanTotal').textContent = `R$ ${totalVal},00`;

    planInfoBox.style.display = 'block';

    // Montar mensagem personalizada para WhatsApp
    const message = planConfig
      ? planConfig.whatsappMessage
      : IPTVYHWH_CONFIG.messages.activation(
          planName,
          priceMonth,
          days,
          totalVal
        );

    wppBtn.href = `https://wa.me/${IPTVYHWH_CONFIG.company.whatsapp}?text=${encodeURIComponent(message)}`;
  } else {
    planInfoBox.style.display = 'none';
    const defaultMsg = IPTVYHWH_CONFIG.messages.activation('', '', '', '');
    wppBtn.href = `https://wa.me/${IPTVYHWH_CONFIG.company.whatsapp}?text=${encodeURIComponent(defaultMsg)}`;
  }
}

function closeActivationModal() {
  document.getElementById('activationModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('activationModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeActivationModal();
});

// ─── FORMULÁRIO DE CONTATO ───────────────────────────
function handleContactForm(e) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input, textarea');
  const name    = inputs[0].value.trim();
  const phone   = inputs[1].value.trim();
  const message = inputs[2].value.trim();

  if (!name || !phone || !message) {
    showToast('Preencha todos os campos!', 'error');
    return;
  }

  const msg = IPTVYHWH_CONFIG.messages.contact(name, phone, message);
  const url = `https://wa.me/${IPTVYHWH_CONFIG.company.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  e.target.reset();
  showToast('Redirecionando para o WhatsApp!');
}

// ─── TOAST NOTIFICATION ──────────────────────────────
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  toastMsg.textContent = msg;

  // Cores por tipo
  const colors = {
    success: 'rgba(16,185,129,0.9)',
    error: 'rgba(239,68,68,0.9)',
    warning: 'rgba(245,158,11,0.9)',
  };

  toast.style.background = colors[type] || colors.success;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── SALVAR LEAD NO BANCO LOCAL ───────────────────────
async function saveLeadToDatabase(leadData) {
  try {
    await fetch('tables/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        device: leadData.device,
        type: leadData.type,
        status: 'trial_requested',
        created_at_display: new Date().toLocaleString('pt-BR'),
      }),
    });
  } catch (e) {
    console.warn('[DB] Não foi possível salvar o lead:', e);
  }
}

// ─── FECHAR MODAIS COM ESC ────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTestModal();
    closeActivationModal();
  }
});

// ─── SMOOTH SCROLL PARA ÂNCORAS ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── ANIMAÇÃO DE HOVER DOS CARDS DE CANAL ─────────────
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px) scale(1.02)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
