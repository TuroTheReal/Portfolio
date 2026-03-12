document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     BURGER MENU
     ============================================ */
  const burger = document.querySelector('.burger');
  const overlay = document.querySelector('.overlay');

  if (burger && overlay) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      overlay.classList.toggle('active');
      // Empêcher le scroll du body quand l'overlay est ouvert
      document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    });

    // Fermer l'overlay
    function closeOverlay() {
      burger.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Fermer au clic sur un lien nav
    overlay.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', closeOverlay);
    });

    // Fermer au clic lang toggle ou theme toggle dans l'overlay
    overlay.querySelectorAll('.lang-toggle, .theme-switch').forEach(btn => {
      btn.addEventListener('click', closeOverlay);
    });

    // Fermer au clic sur le backdrop (zone hors du panel)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOverlay();
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeOverlay();
    });
  }

  /* ============================================
     HEADER AUTO-HIDE (mobile)
     ============================================ */
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;
  let headerHidden = false;

  function handleHeaderScroll() {
    if (!header) return;
    // Seulement sur mobile (< 1024px)
    if (window.innerWidth >= 1024) {
      header.classList.remove('hidden');
      return;
    }

    // Ne pas cacher si l'overlay est ouvert
    if (overlay && overlay.classList.contains('active')) return;

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    // Scroll down > 10px → cacher
    if (scrollDelta > 10 && currentScrollY > 100 && !headerHidden) {
      header.classList.add('hidden');
      headerHidden = true;
    }

    // Scroll up > 10px → montrer
    if (scrollDelta < -10 && headerHidden) {
      header.classList.remove('hidden');
      headerHidden = false;
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ============================================
     FADE-IN AU SCROLL (IntersectionObserver)
     ============================================ */
  const fadeElements = document.querySelectorAll('[data-fade]');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback : tout visible si pas de support
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  /* ============================================
     ACTIVE NAV (IntersectionObserver)
     ============================================ */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav a, .overlay nav a');

  function updateActiveNav(sectionId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href.includes('#')) return;
      if (href.endsWith(`#${sectionId}`)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    // Met à jour le hash sans ajouter d'entrée dans l'historique (sauf page resume)
    if (sectionId && !window.location.pathname.includes('resume') && window.location.hash !== `#${sectionId}`) {
      history.replaceState(null, '', `#${sectionId}`);
    }
  }

  // Page resume : activer le lien CV avec animation
  if (window.location.pathname.includes('resume')) {
    requestAnimationFrame(() => {
      navLinks.forEach(link => {
        if (link.getAttribute('href').includes('resume')) {
          link.classList.add('active');
        }
      });
    });
  }

  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const headerEl = document.querySelector('.header');
    const headerPx = headerEl ? headerEl.offsetHeight : 56;

    // Stocker la section la plus visible
    const sectionRatios = {};

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        sectionRatios[entry.target.id] = entry.intersectionRatio;
      });

      // Trouver la section avec le plus grand ratio visible
      let bestId = null;
      let bestRatio = 0;
      for (const [id, ratio] of Object.entries(sectionRatios)) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      // Si en bas de page, forcer Contact
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        bestId = 'Contact';
      }

      if (bestId) updateActiveNav(bestId);
    }, {
      threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1],
      rootMargin: `-${headerPx}px 0px 0px 0px`
    });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ============================================
     SMOOTH SCROLL avec easing (liens nav)
     ============================================ */
  function smoothScrollTo(targetEl, duration = 800) {
    if (!targetEl) return;
    const headerOffset = header ? header.offsetHeight : 56;
    const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
    const startPos = window.scrollY;
    const distance = targetPos - startPos;
    let startTime = null;

    // Ease in-out cubic
    function ease(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startPos + distance * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        smoothScrollTo(target);
      }
    });
  });

  /* ============================================
     SCROLL VERS HASH AU CHARGEMENT
     (conservation position après changement de langue)
     ============================================ */
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  /* ============================================
     LANG TOGGLE
     Conserve le hash pour garder la position
     ============================================ */
  const langToggles = document.querySelectorAll('.lang-toggle');

  // Déterminer la langue et la page actuelle depuis l'URL folder-based
  // Structure : /en/, /en/resume, /fr/, /fr/resume
  function getCurrentLangAndPage() {
    const path = window.location.pathname;
    const lang = path.startsWith('/fr') ? 'fr' : 'en';
    const isResume = path.includes('resume');
    return { lang, isResume };
  }

  langToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetLang = toggle.dataset.lang;
      const { lang: currentLang, isResume } = getCurrentLangAndPage();
      const currentHash = window.location.hash;

      if (targetLang === currentLang) return;

      const newPath = isResume
        ? `/${targetLang}/resume`
        : `/${targetLang}/`;
      window.location.href = newPath + currentHash;
    });
  });

  /* ============================================
     THEME SWITCH
     Dark par défaut, switch toggle
     ============================================ */
  const themeSwitches = document.querySelectorAll('.theme-switch');

  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  themeSwitches.forEach(btn => btn.addEventListener('click', toggleTheme));

});
