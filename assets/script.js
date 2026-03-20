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

  const isBlogPage = window.location.pathname.includes('blog');
  const isResumePage = window.location.pathname.includes('resume');
  const isRadarPage = window.location.pathname.includes('tech-radar');

  function updateActiveNav(sectionId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      // Retirer active de TOUS les liens (y compris blog, resume)
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      // Activer le lien qui matche la section visible (uniquement les liens avec hash)
      if (href.includes('#') && href.endsWith(`#${sectionId}`)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
    // Met à jour le hash sans ajouter d'entrée dans l'historique (sauf pages resume/blog)
    const pagePath = window.location.pathname;
    if (sectionId && !pagePath.includes('resume') && !pagePath.includes('blog') && !pagePath.includes('tech-radar') && window.location.hash !== `#${sectionId}`) {
      history.replaceState(null, '', `#${sectionId}`);
    }
  }

  // Pages secondaires : activer le lien correspondant par défaut
  function setDefaultActiveNav() {
    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      const href = link.getAttribute('href');
      if (isResumePage && href.includes('resume')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (isRadarPage && href.includes('tech-radar')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (isBlogPage && href.includes('blog')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  requestAnimationFrame(setDefaultActiveNav);

  // Hauteur header cachée une seule fois (évite forced reflow répétés)
  const headerPx = header ? header.offsetHeight : 56;

  if (sections.length > 0 && 'IntersectionObserver' in window) {

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

      // Si en bas de page, forcer Contact (homepage seulement)
      if (!isBlogPage && !isResumePage && !isRadarPage && window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        bestId = 'Contact';
      }

      if (isBlogPage || isResumePage || isRadarPage) {
        // Sur blog/resume : seul Contact (>30% visible) peut override le défaut
        if (bestId === 'Contact' && bestRatio >= 0.3) {
          updateActiveNav(bestId);
        } else {
          setDefaultActiveNav();
        }
      } else {
        if (bestId) updateActiveNav(bestId);
      }
    }, {
      threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1],
      rootMargin: `-${headerPx}px 0px 0px 0px`
    });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ============================================
     SMOOTH SCROLL avec easing (liens nav)
     ============================================ */
  // Ease in-out cubic (partagé entre smoothScrollTo et smoothScrollToTop)
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetEl) {
    if (!targetEl) return;
    const headerOffset = headerPx;
    const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
    const startPos = window.scrollY;
    const distance = targetPos - startPos;
    const duration = Math.min(1600, Math.max(400, Math.abs(distance) * 0.6));
    let startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      window.scrollTo(0, startPos + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function smoothScrollToTop() {
    const startPos = window.scrollY;
    if (startPos === 0) return;
    const duration = Math.min(1600, Math.max(500, startPos * 0.7));
    let startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      window.scrollTo(0, startPos * (1 - easeInOutCubic(progress)));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Logo : comportement contextuel
  // - Homepage : scroll vers #Home (défaut du lien)
  // - Blog listing : scroll to top
  // - Article : retour au blog listing
  // - Resume : retour homepage
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      const path = window.location.pathname;
      const lang = path.startsWith('/fr') ? 'fr' : 'en';
      const isHomepage = !path.includes('blog') && !path.includes('resume') && !path.includes('tech-radar');
      if (isHomepage) return;

      e.preventDefault();
      if (path.includes('resume')) {
        window.location.href = `/${lang}/`;
      } else if (path.includes('tech-radar')) {
        const isRadarListing = path.endsWith('/tech-radar') || path.endsWith('/tech-radar/');
        if (isRadarListing) {
          smoothScrollToTop();
        } else {
          window.location.href = `/${lang}/tech-radar/`;
        }
      } else {
        const isBlogListing = path.endsWith('/blog') || path.endsWith('/blog/');
        if (isBlogListing) {
          smoothScrollToTop();
        } else {
          window.location.href = `/${lang}/blog`;
        }
      }
    });
  }

  // Liens nav Blog/Resume : si déjà sur la page, scroll to top au lieu de recharger
  document.querySelectorAll('.nav a, .overlay nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.includes('#')) return;
      const path = window.location.pathname;
      // Si le lien pointe vers la page actuelle → scroll to top
      if (path.endsWith(href) || path.endsWith(href + '/') || (href + '/') === path) {
        e.preventDefault();
        smoothScrollToTop();
      }
    });
  });

  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      // Extraire le hash (ex: "/en/#Contact" → "#Contact", "#About" → "#About")
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const hash = href.substring(hashIndex);

      // Si la cible existe sur la page courante → scroll local
      const target = document.querySelector(hash);
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
      if (target) smoothScrollTo(target);
    }, 100);
  }

  /* ============================================
     LANG TOGGLE
     Conserve le hash pour garder la position
     ============================================ */
  const langToggles = document.querySelectorAll('.lang-toggle');

  // Déterminer la langue et la page actuelle depuis l'URL folder-based
  // Structure : /en/, /en/resume, /en/blog, /en/tech-radar, /fr/, /fr/resume, /fr/blog, /fr/tech-radar
  function getCurrentLangAndPage() {
    const path = window.location.pathname;
    const lang = path.startsWith('/fr') ? 'fr' : 'en';
    const isResume = path.includes('resume');
    const isBlog = path.includes('blog');
    const isRadar = path.includes('tech-radar');
    return { lang, isResume, isBlog, isRadar };
  }

  langToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetLang = toggle.dataset.lang;
      const { lang: currentLang, isResume, isBlog, isRadar } = getCurrentLangAndPage();
      const currentHash = window.location.hash;

      if (targetLang === currentLang) return;

      // Construire le nouveau path en remplaçant /en/ ou /fr/ par la langue cible
      const path = window.location.pathname;
      let newPath;
      if (isBlog || isRadar) {
        // Remplace /en/blog/... ou /fr/blog/... ou /en/tech-radar/... par /{targetLang}/...
        newPath = path.replace(/^\/(en|fr)\//, `/${targetLang}/`);
      } else if (isResume) {
        newPath = `/${targetLang}/resume`;
      } else {
        newPath = `/${targetLang}/`;
      }

      // Sauvegarder la position de scroll pour la restaurer après rechargement
      sessionStorage.setItem('scrollPos', window.scrollY);
      window.location.href = newPath + currentHash;
    });
  });

  // Restaurer la position de scroll après un switch de langue
  const savedScroll = sessionStorage.getItem('scrollPos');
  if (savedScroll !== null) {
    sessionStorage.removeItem('scrollPos');
    const pos = parseInt(savedScroll, 10);
    window.scrollTo(0, pos);
    requestAnimationFrame(() => window.scrollTo(0, pos));
  }

  /* ============================================
     THEME SWITCH
     Dark par défaut, switch toggle
     ============================================ */
  const themeInputs = document.querySelectorAll('.switch__input');

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  // Sync checkbox et meta theme-color avec l'état initial du thème
  const isLightInit = document.body.classList.contains('light-theme');
  themeInputs.forEach(input => input.checked = isLightInit);
  if (themeColorMeta && isLightInit) themeColorMeta.content = '#f0f1f2';

  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    // Sync toutes les checkboxes (header + overlay)
    themeInputs.forEach(input => input.checked = isLight);
    // Sync meta theme-color pour la barre du navigateur mobile
    if (themeColorMeta) themeColorMeta.content = isLight ? '#f0f1f2' : '#121212';
  }

  themeInputs.forEach(input => input.addEventListener('change', toggleTheme));

  /* ============================================
     SCROLL FADE — indicateurs de scroll horizontal
     ============================================ */
  function initScrollFade(el, fadeTarget) {
    if (!el) return;
    const target = fadeTarget || el;
    function update() {
      const threshold = 4;
      const canLeft = el.scrollLeft > threshold;
      const canRight = el.scrollLeft + el.clientWidth < el.scrollWidth - threshold;
      target.classList.toggle('fade-left', canLeft);
      target.classList.toggle('fade-right', canRight);
    }
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  const radarFilterEl = document.querySelector('.radar-tags-filter');
  const radarFadeEl = document.querySelector('.radar-filter-fade');
  if (radarFilterEl && radarFadeEl) {
    radarFadeEl.style.setProperty('--radar-filter-h', radarFilterEl.offsetHeight + 'px');
    initScrollFade(radarFilterEl, radarFadeEl);
  }

  /* ============================================
     BLOG TAG FILTER
     Boutons générés dynamiquement depuis les data-tags des cards
     ============================================ */
  const tagFilter = document.querySelector('.blog-tags-filter');
  const blogCards = document.querySelectorAll('.blog-card[data-tags]');

  if (tagFilter && blogCards.length > 0) {
    // Extraire tous les tags uniques depuis les cards
    const allTags = new Set();
    blogCards.forEach(card => {
      card.dataset.tags.split(',').forEach(tag => allTags.add(tag.trim()));
    });

    // Vider les boutons hardcodés et reconstruire dynamiquement
    tagFilter.innerHTML = '';

    // Langue courante pour les labels
    const currentLang = window.location.pathname.startsWith('/fr') ? 'fr' : 'en';

    // Bouton "All/Tous" en premier
    const allBtn = document.createElement('button');
    allBtn.textContent = currentLang === 'fr' ? 'Tous' : 'All';
    allBtn.dataset.tag = 'all';
    allBtn.classList.add('active');
    tagFilter.appendChild(allBtn);

    // Map de traduction pour les tags selon la langue
    const tagLabels = {
      fr: { career: 'Carrière', devops: 'DevOps', dev: 'Dev', project: 'Projet', ai: 'IA' },
      en: { career: 'Career', devops: 'DevOps', dev: 'Dev', project: 'Project', ai: 'AI' }
    };

    // Un bouton par tag unique (trié alphabétiquement)
    [...allTags].sort().forEach(tag => {
      const btn = document.createElement('button');
      // Affichage traduit si disponible, sinon première lettre majuscule
      const labels = tagLabels[currentLang] || {};
      btn.textContent = labels[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
      btn.dataset.tag = tag;
      tagFilter.appendChild(btn);
    });

    // Attacher les événements de filtrage
    tagFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-tag]');
      if (!btn) return;

      const tag = btn.dataset.tag;

      // Mettre à jour le bouton actif
      tagFilter.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

      // Filtrer les cards
      blogCards.forEach(card => {
        const cardTags = card.dataset.tags.split(',').map(t => t.trim());
        const matches = tag === 'all' || cardTags.includes(tag);

        if (matches) {
          card.classList.remove('blog-card-hidden');
        } else {
          card.classList.add('blog-card-hidden');
        }
      });
    });

    // Init scroll fade après génération des boutons
    const blogFadeEl = document.querySelector('.blog-filter-fade');
    if (blogFadeEl) {
      blogFadeEl.style.setProperty('--blog-filter-h', tagFilter.offsetHeight + 'px');
      initScrollFade(tagFilter, blogFadeEl);
    } else {
      initScrollFade(tagFilter);
    }
  }

  /* ============================================
     TECH RADAR — LOAD MORE
     ============================================ */
  const radarLoadMore = document.querySelector('.radar-load-more');
  if (radarLoadMore) {
    let expanded = sessionStorage.getItem('radarExpanded') === 'true';
    const allCards = document.querySelectorAll('.radar-card--hidden');
    // Cache le lien s'il n'y a rien à charger
    if (allCards.length === 0 && !expanded) {
      radarLoadMore.style.display = 'none';
    }
    const isFr = document.documentElement.lang === 'fr';
    const labelMore = isFr ? 'Voir plus →' : 'Show more →';
    const labelLess = isFr ? '← Voir moins' : '← Show less';
    // Restaurer l'état après switch de langue
    if (expanded) {
      allCards.forEach(card => card.classList.remove('radar-card--hidden'));
      radarLoadMore.textContent = labelLess;
    }
    radarLoadMore.addEventListener('click', (e) => {
      e.preventDefault();
      if (!expanded) {
        allCards.forEach(card => card.classList.remove('radar-card--hidden'));
        radarLoadMore.textContent = labelLess;
        expanded = true;
      } else {
        allCards.forEach(card => card.classList.add('radar-card--hidden'));
        radarLoadMore.textContent = labelMore;
        expanded = false;
        document.querySelector('.radar-listing')?.scrollIntoView({ behavior: 'smooth' });
      }
      sessionStorage.setItem('radarExpanded', expanded);
    });
  }

  /* ============================================
     TECH RADAR — CATEGORY FILTER (scroll to section)
     ============================================ */
  const radarFilter = document.querySelector('.radar-tags-filter');
  if (radarFilter) {
    const filterBtns = radarFilter.querySelectorAll('.radar-filter-btn');
    const hdrPx = headerPx;
    let isScrolling = false;
    let scrollTimer = null;

    function endScrollLock() {
      function onScroll() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          isScrolling = false;
          window.removeEventListener('scroll', onScroll);
        }, 100);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      // Fallback si déjà à destination (pas de scroll déclenché)
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
        window.removeEventListener('scroll', onScroll);
      }, 600);
    }

    radarFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('.radar-filter-btn');
      if (!btn) return;

      const category = btn.dataset.category;

      isScrolling = true;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (category === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        endScrollLock();
        return;
      }

      const targetTag = document.querySelector(`.article-body .radar-tag--${category}`);
      if (targetTag) {
        const h2 = targetTag.closest('h2');
        if (h2) {
          const filterH = radarFilter.offsetHeight || 40;
          const top = h2.getBoundingClientRect().top + window.scrollY - hdrPx - filterH - 16;
          window.scrollTo({ top, behavior: 'smooth' });
          endScrollLock();
        }
      }
    });

    // Observer les h2 pour mettre à jour le bouton actif au scroll manuel
    const sectionH2s = document.querySelectorAll('.article-body h2');
    if (sectionH2s.length > 0) {
      const filterH = radarFilter.offsetHeight || 40;
      const topOffset = hdrPx + filterH + 20;

      function updateActiveCategory() {
        if (isScrolling) return;
        // Trouver la première h2 dont le top est sous le header+filtre
        let activeH2 = null;
        for (const h2 of sectionH2s) {
          const rect = h2.getBoundingClientRect();
          if (rect.top <= topOffset + 40) {
            activeH2 = h2;
          } else {
            break;
          }
        }
        if (!activeH2) return;
        const tag = activeH2.querySelector('[class*="radar-tag--"]');
        if (!tag) return;
        const match = [...tag.classList].find(c => c.startsWith('radar-tag--'));
        if (!match) return;
        const catName = match.replace('radar-tag--', '');
        const currentActive = radarFilter.querySelector('.radar-filter-btn.active');
        if (currentActive && currentActive.dataset.category === catName) return;
        filterBtns.forEach(b => b.classList.remove('active'));
        const matchBtn = radarFilter.querySelector(`[data-category="${catName}"]`);
        if (matchBtn) {
          matchBtn.classList.add('active');
          matchBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }

      window.addEventListener('scroll', updateActiveCategory, { passive: true });

      // "Tous" actif quand tout en haut de la page
      const allBtn = radarFilter.querySelector('[data-category="all"]');
      window.addEventListener('scroll', () => {
        if (isScrolling) return;
        if (window.scrollY < 100 && allBtn && !allBtn.classList.contains('active')) {
          filterBtns.forEach(b => b.classList.remove('active'));
          allBtn.classList.add('active');
        }
      }, { passive: true });
    }
  }

});
