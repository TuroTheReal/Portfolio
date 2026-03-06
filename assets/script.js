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
    overlay.querySelectorAll('.lang-toggle, .theme-toggle').forEach(btn => {
      btn.addEventListener('click', closeOverlay);
    });

    // Fermer au clic sur le backdrop (zone hors du panel)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOverlay();
    });
  }

  /* ============================================
     HEADER AUTO-HIDE (mobile)
     ============================================ */
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;
  let headerHidden = false;

  function handleHeaderScroll() {
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
      if (href === `#${sectionId}` || href === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
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

  // Carte des pages EN ↔ FR
  const pageMap = {
    'index_en':  { fr: 'index_fr',  en: 'index_en' },
    'index_fr':  { fr: 'index_fr',  en: 'index_en' },
    'resume_en': { fr: 'resume_fr', en: 'resume_en' },
    'resume_fr': { fr: 'resume_fr', en: 'resume_en' }
  };

  // Déterminer la page actuelle
  function getCurrentPage() {
    let path = window.location.pathname.split('/').filter(Boolean).pop() || 'index_en';
    // Retirer le slash final
    if (path.endsWith('/')) path = path.slice(0, -1);
    // Retirer l'extension .html si présente
    path = path.replace('.html', '');
    return path;
  }

  langToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetLang = toggle.dataset.lang;
      const currentPage = getCurrentPage();
      const currentHash = window.location.hash;

      const mappedPage = pageMap[currentPage]?.[targetLang];
      if (mappedPage && mappedPage !== currentPage) {
        window.location.href = mappedPage + currentHash;
      }
    });
  });

  /* ============================================
     THEME TOGGLE
     Dark par défaut, pas de reload
     ============================================ */
  const themeToggles = document.querySelectorAll('.theme-toggle');

  // Initialiser le thème
  // Priorité : localStorage > prefers-color-scheme > dark par défaut
  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.body.classList.add('light-theme');
    } else if (!saved && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.body.classList.add('light-theme');
    }
    updateThemeIcon();
  }

  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const isLight = document.body.classList.contains('light-theme');
    const isFr = document.documentElement.lang === 'fr';
    const moonSVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeToggles.forEach(btn => {
      btn.innerHTML = isLight ? moonSVG : '☀';
      if (isFr) {
        btn.setAttribute('aria-label', isLight ? 'Passer en mode sombre' : 'Passer en mode clair');
      } else {
        btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      }
    });
  }

  themeToggles.forEach(btn => btn.addEventListener('click', toggleTheme));
  initTheme();

});
