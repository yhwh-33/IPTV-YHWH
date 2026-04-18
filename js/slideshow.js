/**
 * ============================================================
 *  STREAMMAX IPTV — SLIDESHOW ENGINE
 *  Controla o Hero Slideshow e o Bottom Showcase Slideshow
 * ============================================================
 */

/* ────────────────────────────────────────────────────────────
   1. HERO SLIDESHOW
   Troca slides automaticamente com efeito Ken Burns + fade
   ──────────────────────────────────────────────────────────── */
(function HeroSlideshow() {

  const INTERVAL  = 6000;   // ms entre slides
  const DURATION  = 1400;   // ms da transição fade (deve bater com CSS)

  let currentIndex  = 0;
  let totalSlides   = 0;
  let autoTimer     = null;
  let progressTimer = null;
  let isPaused      = false;

  // Aguarda o DOM
  document.addEventListener('DOMContentLoaded', () => {
    const slides    = document.querySelectorAll('.hero-slide');
    const dots      = document.querySelectorAll('.hs-dot');
    const labelEl   = document.getElementById('heroSlideLabel');
    const catEl     = document.getElementById('heroSlideCat');
    const progressEl = document.getElementById('heroProgress');
    const section   = document.getElementById('heroSlideshow');

    totalSlides = slides.length;
    if (!totalSlides) return;

    // Pausa ao hover
    if (section) {
      section.addEventListener('mouseenter', () => { isPaused = true; pauseProgress(); });
      section.addEventListener('mouseleave', () => { isPaused = false; startProgress(); });
    }

    // Inicia
    startProgress();
    startAutoPlay();

    /**
     * Vai para um slide específico
     */
    function goToSlide(index) {
      if (index === currentIndex) return;

      const oldSlide = slides[currentIndex];
      const newSlide = slides[index];

      // Sai
      oldSlide.classList.add('exiting');
      oldSlide.classList.remove('active');

      // Entra
      newSlide.classList.add('active');

      // Remove classe de saída depois da transição
      setTimeout(() => oldSlide.classList.remove('exiting'), DURATION);

      // Atualiza dots
      dots.forEach(d => d.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');

      // Atualiza label / categoria com animação
      const label = newSlide.dataset.label;
      const cat   = newSlide.dataset.category;

      if (labelEl) {
        labelEl.classList.remove('changing');
        void labelEl.offsetWidth; // reflow
        labelEl.textContent = label || '';
        labelEl.classList.add('changing');
      }
      if (catEl) {
        catEl.classList.remove('changing');
        void catEl.offsetWidth;
        catEl.textContent = cat || '';
        catEl.classList.add('changing');
      }

      currentIndex = index;

      // Reinicia barra de progresso
      resetProgress();
      startProgress();
    }

    // Expõe globalmente para os botões inline do HTML
    window.goToHeroSlide = goToSlide;

    function nextSlide() {
      goToSlide((currentIndex + 1) % totalSlides);
    }

    /* ── Auto play ── */
    function startAutoPlay() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (!isPaused) nextSlide();
      }, INTERVAL);
    }

    /* ── Barra de progresso ── */
    function startProgress() {
      if (!progressEl) return;
      // Transição linear de 0% → 100% em INTERVAL ms
      progressEl.style.transition = `width ${INTERVAL}ms linear`;
      progressEl.style.width = '100%';
    }

    function resetProgress() {
      if (!progressEl) return;
      progressEl.style.transition = 'none';
      progressEl.style.width = '0%';
      // Força reflow para reiniciar a transição
      void progressEl.offsetWidth;
    }

    function pauseProgress() {
      if (!progressEl) return;
      const computed = getComputedStyle(progressEl).width;
      progressEl.style.transition = 'none';
      progressEl.style.width = computed;
    }
  });

})();


/* ────────────────────────────────────────────────────────────
   2. BOTTOM SHOWCASE SLIDESHOW
   Carrossel horizontal de cards com drag/swipe
   ──────────────────────────────────────────────────────────── */
(function BottomShowcase() {

  const AUTO_INTERVAL = 4500; // ms entre slides automáticos

  document.addEventListener('DOMContentLoaded', () => {
    const track      = document.getElementById('bssTrack');
    const prevBtn    = document.getElementById('bssPrev');
    const nextBtn    = document.getElementById('bssNext');
    const dotsEl     = document.getElementById('bssDots');

    if (!track) return;

    const cards     = track.querySelectorAll('.bss-card');
    const totalCards = cards.length;

    // Calcula quantos cards ficam visíveis de uma vez
    let visibleCount  = getVisibleCount();
    let maxStep       = totalCards - visibleCount;
    let currentStep   = 0;
    let autoTimer     = null;
    let isHovered     = false;

    // Drag / swipe
    let dragStartX    = 0;
    let isDragging    = false;

    // Inicia
    updateDots();
    updateButtons();
    startAuto();

    /* ── Navegação ── */
    prevBtn?.addEventListener('click', () => {
      go(currentStep - 1);
      resetAuto();
    });

    nextBtn?.addEventListener('click', () => {
      go(currentStep + 1);
      resetAuto();
    });

    /* ── Pausa no hover ── */
    const wrapper = track.closest('.bss-track-wrapper');
    wrapper?.addEventListener('mouseenter', () => { isHovered = true; });
    wrapper?.addEventListener('mouseleave', () => { isHovered = false; });

    /* ── Drag (mouse) ── */
    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      track.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = '';
      const diff = dragStartX - e.clientX;
      if (Math.abs(diff) > 60) {
        go(diff > 0 ? currentStep + 1 : currentStep - 1);
        resetAuto();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });

    /* ── Swipe (touch) ── */
    track.addEventListener('touchstart', (e) => {
      dragStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = dragStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        go(diff > 0 ? currentStep + 1 : currentStep - 1);
        resetAuto();
      }
    }, { passive: true });

    /* ── Resize ── */
    window.addEventListener('resize', () => {
      visibleCount = getVisibleCount();
      maxStep      = Math.max(0, totalCards - visibleCount);
      currentStep  = Math.min(currentStep, maxStep);
      applyTranslate();
      updateDots();
      updateButtons();
    });

    /**
     * Navega para o step desejado
     */
    function go(step) {
      // Loop suave: se chegar no fim, volta ao início e vice-versa
      if (step > maxStep) step = 0;
      if (step < 0)       step = maxStep;

      currentStep = step;
      applyTranslate();
      updateDots();
      updateButtons();
    }

    /**
     * Aplica a translação no track
     */
    function applyTranslate() {
      if (!cards[currentStep]) return;
      const cardWidth = cards[currentStep].offsetWidth + getGap();
      const translate = currentStep * cardWidth;
      track.style.transform = `translateX(-${translate}px)`;
    }

    /**
     * Gap entre cards (lê do CSS)
     */
    function getGap() {
      const computedGap = getComputedStyle(track).gap;
      return parseInt(computedGap) || 20;
    }

    /**
     * Quantos cards cabem visualmente
     */
    function getVisibleCount() {
      const ww = window.innerWidth;
      if (ww < 600)  return 1;
      if (ww < 900)  return 2;
      if (ww < 1200) return 3;
      return 4;
    }

    /**
     * Atualiza bolinhas de posição
     */
    function updateDots() {
      if (!dotsEl) return;
      const dotEls = dotsEl.querySelectorAll('.bss-indicator-dot');
      const groups = maxStep + 1 || 1;

      // Gera dots dinamicamente se necessário
      if (dotEls.length !== groups) {
        dotsEl.innerHTML = '';
        for (let i = 0; i < groups; i++) {
          const d = document.createElement('div');
          d.className = 'bss-indicator-dot' + (i === currentStep ? ' active' : '');
          d.addEventListener('click', () => { go(i); resetAuto(); });
          dotsEl.appendChild(d);
        }
      } else {
        dotEls.forEach((d, i) => d.classList.toggle('active', i === currentStep));
      }
    }

    /**
     * Habilita/desabilita botões nas extremidades
     * (desabilitado porque temos loop, mas deixamos estilizado)
     */
    function updateButtons() {
      // Com loop sempre ativo, não desabilitamos os botões
    }

    /* ── Auto play ── */
    function startAuto() {
      autoTimer = setInterval(() => {
        if (!isHovered) go(currentStep + 1);
      }, AUTO_INTERVAL);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

  });

})();


/* ────────────────────────────────────────────────────────────
   3. EFEITO DE ENTRADA DOS CARDS AO SCROLL
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (!('IntersectionObserver' in window)) return;

  const cards = document.querySelectorAll('.bss-card');
  cards.forEach((card, i) => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => obs.observe(card));
});
