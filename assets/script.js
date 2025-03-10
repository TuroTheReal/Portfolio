// // Fonction pour gérer le switch de thème
// document.addEventListener('DOMContentLoaded', () => {
// 	// Définir le thème sombre par défaut
// 	document.body.classList.add('dark-theme');

// 	// Récupérer l'élément switch de thème
// 	const themeSwitch = document.getElementById('theme-switch');

// 	// Configurer l'écouteur d'événement
// 	themeSwitch.addEventListener('change', () => {
// 		if (themeSwitch.checked) {
// 		// Mode sombre
// 		document.body.classList.add('dark-theme');
// 		document.body.classList.remove('light-theme');
// 		} else {
// 		// Mode clair
// 		document.body.classList.add('light-theme');
// 		document.body.classList.remove('dark-theme');
// 		}
// 	});

// 	// Récupérer l'élément switch de langue
// 	const langSwitch = document.getElementById('lang-switch');

// 	// Configurer l'écouteur d'événement pour la langue
// 	if (langSwitch) {
// 		langSwitch.addEventListener('change', () => {
// 		if (langSwitch.checked) {
// 			// Mode français
// 			document.documentElement.lang = 'fr';
// 			// Cacher les éléments en anglais et montrer les éléments en français
// 			document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'none');
// 			document.querySelectorAll('.lang-fr').forEach(el => el.style.display = 'block');
// 		} else {
// 			// Mode anglais
// 			document.documentElement.lang = 'en';
// 			// Cacher les éléments en français et montrer les éléments en anglais
// 			document.querySelectorAll('.lang-fr').forEach(el => el.style.display = 'none');
// 			document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'block');
// 		}
// 		});

// 		// Définir l'anglais comme langue par défaut
// 		document.querySelectorAll('.lang-fr').forEach(el => el.style.display = 'none');
// 	}
//   });








document.addEventListener('DOMContentLoaded', function() {
	// Sélectionner tous les liens de navigation et les sections
	const navLinks = document.querySelectorAll('.menu a');
	const sections = document.querySelectorAll('section');
	const headerHeight = 63; // Ajustez selon la hauteur de votre menu

	// Variable pour indiquer si un défilement programmé est en cours
	let isProgrammaticScrolling = false;

	// Fonction pour animer le défilement
	function smoothScroll(target, duration) {
	  isProgrammaticScrolling = true;
	  const targetPosition = target.offsetTop - headerHeight;
	  const startPosition = window.pageYOffset;
	  const distance = targetPosition - startPosition;
	  let startTime = null;

	  function animation(currentTime) {
		if (startTime === null) startTime = currentTime;
		const elapsedTime = currentTime - startTime;
		const run = ease(elapsedTime, startPosition, distance, duration);
		window.scrollTo(0, run);
		if (elapsedTime < duration) {
		  requestAnimationFrame(animation);
		} else {
		  isProgrammaticScrolling = false;
		}
	  }

	  // Fonction d'easing pour une animation fluide
	  function ease(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t + b;
		t -= 2;
		return c / 2 * (t * t * t + 2) + b;
	  }

	  requestAnimationFrame(animation);
	}

	// Ajouter les écouteurs d'événements de clic aux liens de navigation
	navLinks.forEach(link => {
	  link.addEventListener('click', function(e) {
		e.preventDefault();

		// Récupérer la cible du lien
		const targetId = this.getAttribute('href');
		const targetSection = document.querySelector(targetId);

		if (targetSection) {
		  // Supprimer la classe active de tous les liens
		  navLinks.forEach(navLink => navLink.classList.remove('active'));

		  // Ajouter la classe active au lien cliqué
		  this.classList.add('active');

		  // Défiler jusqu'à la section cible
		  smoothScroll(targetSection, 800);
		}
	  });
	});

	// Fonction pour déterminer quelle section est actuellement visible
	function setActiveNavOnScroll() {
	  // Ne pas exécuter cette fonction pendant un défilement programmé
	  if (isProgrammaticScrolling) return;

	  // Position actuelle du défilement plus un petit offset
	  const scrollPosition = window.pageYOffset + (headerHeight + 5);

	  // Vérifier si nous sommes au bas de la page
	  const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 20;

	  if (isAtBottom) {
		// Au bas de la page, activer le dernier lien de navigation
		navLinks.forEach(navLink => navLink.classList.remove('active'));
		navLinks[navLinks.length - 1].classList.add('active');
		return;
	  }

	  // Parcourir toutes les sections pour trouver celle qui est visible
	  let foundActiveSection = false;

	  sections.forEach((section, index) => {
		const sectionTop = section.offsetTop;
		const sectionBottom = sectionTop + section.offsetHeight;

		if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
		  foundActiveSection = true;
		  // Récupérer l'ID de la section active
		  const id = section.getAttribute('id');

		  // Supprimer la classe active de tous les liens
		  navLinks.forEach(navLink => navLink.classList.remove('active'));

		  // Ajouter la classe active au lien correspondant
		  const activeLink = document.querySelector(`.menu a[href="#${id}"]`);
		  if (activeLink) {
			activeLink.classList.add('active');
		  }
		}
	  });

	  // Si aucune section n'est trouvée comme active (peut arriver entre les sections)
	  // Conserver l'état actuel
	}

	// Ajouter un écouteur d'événement pour le défilement avec debounce
	let scrollTimer;
	window.addEventListener('scroll', function() {
	  clearTimeout(scrollTimer);
	  scrollTimer = setTimeout(setActiveNavOnScroll, 50);
	});

	// S'assurer que la dernière section est suffisamment haute
	function ensureLastSectionHeight() {
	  const lastSection = sections[sections.length - 1];
	  const viewportHeight = window.innerHeight;

	  if (lastSection.offsetHeight < viewportHeight) {
		lastSection.style.minHeight = viewportHeight + 'px';
	  }
	}

	// Appeler ensureLastSectionHeight et setActiveNavOnScroll au chargement
	ensureLastSectionHeight();
	setActiveNavOnScroll();

	// Aussi lors du redimensionnement de la fenêtre
	window.addEventListener('resize', function() {
	  ensureLastSectionHeight();
	  setActiveNavOnScroll();
	});
  });











// document.addEventListener('DOMContentLoaded', () => {
// 	const menuLinks = document.querySelectorAll('.menu a');
// 	const headerHeight = 64; // Ajustez selon la hauteur de votre menu

// 	// Variable pour suivre si un défilement programmé est en cours
// 	let isScrolling = false;

// 	function scrollToElement(element, duration) {
// 		// Indiquer qu'un défilement programmé est en cours
// 		isScrolling = true;

// 		const startPosition = window.pageYOffset;
// 		const targetPosition = element.getBoundingClientRect().top + startPosition - headerHeight;
// 		let startTime = null;

// 		function animation(currentTime) {
// 		if (startTime === null) startTime = currentTime;
// 		const timeElapsed = currentTime - startTime;
// 		const progress = Math.min(timeElapsed / duration, 1);

// 		// Fonction ease-in-out
// 		const ease = progress => {
// 			return progress < 0.5
// 			? 4 * progress * progress * progress
// 			: 1 - Math.pow(-2 * progress + 2, 3) / 2;
// 		};

// 		window.scrollTo(0, startPosition + (targetPosition - startPosition) * ease(progress));

// 		if (timeElapsed < duration) {
// 			requestAnimationFrame(animation);
// 		} else {
// 			// Animation terminée
// 			isScrolling = false;
// 		}
// 		}

// 		requestAnimationFrame(animation);
// 	}

// 	// Fonction pour activer le lien correspondant à une section
// 	function setActiveLink(targetId) {
// 		menuLinks.forEach(link => {
// 		link.classList.remove('active');
// 		if (link.getAttribute('href') === targetId) {
// 			link.classList.add('active');
// 		}
// 		});
// 	}

// 	// Ajouter un événement de clic pour le défilement personnalisé
// 	menuLinks.forEach(link => {
// 		link.addEventListener('click', (e) => {
// 		e.preventDefault();
// 		const targetId = link.getAttribute('href');
// 		const targetSection = document.querySelector(targetId);

// 		if (targetSection) {
// 			// Activer le lien immédiatement
// 			setActiveLink(targetId);

// 			// Puis défiler vers la section
// 			scrollToElement(targetSection, 800);
// 		}
// 		});
// 	});

// 	// Mettre à jour l'état actif lors du défilement manuel (seulement si pas de défilement programmé)
// 	window.addEventListener('scroll', () => {
// 		// Ne pas exécuter pendant un défilement programmé
// 		if (isScrolling) return;

// 		// Utiliser un throttling pour limiter les appels
// 		if (!window.scrollThrottleTimer) {
// 		window.scrollThrottleTimer = setTimeout(() => {
// 			const scrollPosition = window.scrollY;

// 			// Trouver la section actuellement visible
// 			const sections = document.querySelectorAll('section');
// 			let currentSection = null;

// 			sections.forEach(section => {
// 			const sectionTop = section.offsetTop - (headerHeight + 10);
// 			const sectionBottom = sectionTop + section.offsetHeight;

// 			if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
// 				currentSection = section;
// 			}
// 			});

// 			// Mettre à jour le lien actif si une section est visible
// 			if (currentSection) {
// 			const currentId = '#' + currentSection.getAttribute('id');
// 			setActiveLink(currentId);
// 			}

// 			window.scrollThrottleTimer = null;
// 		}, 100);
// 		}
// 	});

// 	// Initialiser le lien actif au chargement de la page
// 	function initActiveLink() {
// 		const scrollPosition = window.scrollY;
// 		const sections = document.querySelectorAll('section');

// 		sections.forEach(section => {
// 		const sectionTop = section.offsetTop - (headerHeight + 10);
// 		const sectionBottom = sectionTop + section.offsetHeight;

// 		if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
// 			const currentId = '#' + section.getAttribute('id');
// 			setActiveLink(currentId);
// 		}
// 		});
// 	}

// 	// Initialiser au chargement
// 	initActiveLink();
// });
