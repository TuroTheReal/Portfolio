// POUR LE SCROLL

document.addEventListener('DOMContentLoaded', function() {
	// Sélectionner tous les liens de navigation et les sections
	const navLinks = document.querySelectorAll('.menu a');
	const sections = document.querySelectorAll('section');
	const headerHeight = 64; // Ajustez selon la hauteur de votre menu

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
		const targetId = this.getAttribute('href');

		// Déterminer si nous sommes sur une page d'index
		const isIndexPage = window.location.pathname.includes('index') ||
						  window.location.pathname === '/' ||
						  window.location.pathname === '';

		// Cas 1 : Liens internes à la page actuelle (commencent par #)
		if (targetId.startsWith('#')) {
			e.preventDefault();
			const targetSection = document.querySelector(targetId);

			if (targetSection) {
				// Code existant pour le défilement fluide
				navLinks.forEach(navLink => navLink.classList.remove('active'));
				this.classList.add('active');
				smoothScroll(targetSection, 800);
			}
			return;
		}

		// Cas 2 : Liens vers une autre page (contenant # mais ne commençant pas par #)
		if (targetId.includes('#') && !targetId.startsWith('#')) {
			// Si on est sur une page d'index et qu'on clique sur un lien vers une page d'index,
			// on pourrait vouloir gérer le scroll au lieu de la navigation
			const targetBase = targetId.split('#')[0];
			const currentPath = window.location.pathname;

			// Si on essaie de naviguer vers la page où on est déjà
			if ((currentPath.endsWith(targetBase) ||
				(currentPath === '/' && targetBase === '/index_en') ||
				(currentPath === '/' && targetBase === '/index_fr'))) {
				e.preventDefault();
				const targetSection = document.querySelector('#' + targetId.split('#')[1]);
				if (targetSection) {
					navLinks.forEach(navLink => navLink.classList.remove('active'));
					this.classList.add('active');
					smoothScroll(targetSection, 800);
				}
				return;
			}

			// navigation normale vers une autre page avec ancre
			return; // Laisser le comportement par défaut
		}

		// Cas 3 : Liens sans # (navigation normale)
		return; // Laisser le comportement par défaut
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

	// S'assurer que la dernière section est suffisamment haute, mais éviter d'agrandir la section Work
	function ensureLastSectionHeight() {
		const lastSection = sections[sections.length - 1];
		const viewportHeight = window.innerHeight;

		if (lastSection.id !== "Work" && lastSection.offsetHeight < viewportHeight) {
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

	// Gestion des liens entre pages avec des ancres
	// Vérifier si l'URL contient un hash (ancre)
	if (window.location.hash) {
		// Petit délai pour s'assurer que la page est chargée
		setTimeout(function() {
			const targetId = window.location.hash;
			const targetSection = document.querySelector(targetId);

			if (targetSection) {
				smoothScroll(targetSection, 800);

				// Mettre à jour la classe active dans la navigation
				navLinks.forEach(navLink => navLink.classList.remove('active'));
				const activeLink = document.querySelector(`.menu a[href="${targetId}"]`);
				if (activeLink) {
					activeLink.classList.add('active');
				}
			}
		}, 100);
	}
});

// POUR LA GESTION DES PRETTY URLS ET DE LA LANGUE
document.addEventListener('DOMContentLoaded', () => {
	const langSwitch = document.getElementById('lang-switch');
	if (!langSwitch) return;

	// Extraire le nom de la page actuelle sans l'extension .html
	const currentURL = window.location.pathname;
	let currentPage = currentURL.split('/').filter(part => part).pop() || 'index_en';

	// Supprimer le slash final si présent
	if (currentPage.endsWith('/')) {
		currentPage = currentPage.slice(0, -1);
	}

	const isCurrentlyFrench = currentPage.includes('fr') || currentPage.includes('FR');

	// Configurer l'état initial
	langSwitch.checked = isCurrentlyFrench;

	// Carte de pages mise à jour sans extensions .html
	const pageMap = {
		'index_fr': { fr: 'index_fr', en: 'index_en' },
		'index_en': { fr: 'index_fr', en: 'index_en' },
		'resume_fr': { fr: 'resume_fr', en: 'resume_en' },
		'resume_en': { fr: 'resume_fr', en: 'resume_en' }
	};

	// Gestionnaire de changement de langue
	langSwitch.addEventListener('change', function() {
		const newLanguage = this.checked ? 'fr' : 'en';
		const mappedPage = pageMap[currentPage]?.[newLanguage] || 'index_en';

		window.location.href = mappedPage;
	});
});

// POUR LE TEXTE PAGE WELCOME

document.addEventListener('DOMContentLoaded', function() {
	// Vérifier si l'élément existe avant de procéder
	const animatedText = document.getElementById('animated-text');
	if (!animatedText) {
		console.error("L'élément avec l'ID 'animated-text' n'a pas été trouvé");
		return;
	}

	// Définir les salutations à afficher en rotation
	const greetings = ["Welcome.", "Bienvenue.", "Hello.", "Bonjour."];
	let currentIndex = 0;

	// Caractères pour l'effet de brouillage
	const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

	// Fonction pour obtenir un caractère aléatoire
	function getRandomChar() {
		return randomChars.charAt(Math.floor(Math.random() * randomChars.length));
	}

	// Fonction pour animer la transition vers un nouveau texte
	function animateTextChange(newText) {
		// Conserver une copie du texte actuel
		const currentText = animatedText.textContent;

		// Créer un tableau de caractères pour le suivi
		let chars = currentText.split('');

		// Pour les nouveaux caractères qui n'existent pas dans le texte actuel
		while (chars.length < newText.length) {
			chars.push(' ');
		}

		// Paramètres d'animation
		const phaseDuration = 2000;// Durée de l'animation en millisecondes (4 secondes)
		const frameDuration = 40;	// Durée entre chaque mise à jour (millisecondes)
		const totalFrames = Math.floor(phaseDuration / frameDuration);

		let animationFrame = 0;

		// Créer un tableau pour suivre quels caractères ont été fixés
		const fixedChars = new Array(chars.length).fill(false);

		// Fonction d'animation qui s'exécute à chaque frame
		function animate() {
			animationFrame++;

			// Phase de l'animation entre 0 et 1
			const phase = animationFrame / totalFrames;

			// Nombre de caractères à fixer pour cette frame
			const charsToFix = Math.floor(phase * newText.length * 1.5);

			// Pour chaque caractère...
			for (let i = 0; i < chars.length; i++) {
				// Si ce caractère doit être fixé...
				if (!fixedChars[i] && (Math.random() < 0.1 || animationFrame > totalFrames * 0.8)) {
					if (i < newText.length && i < charsToFix) {
						// Fixer ce caractère à sa valeur finale
						chars[i] = newText[i];
						fixedChars[i] = true;
					}
				}

				// Si ce caractère n'est pas encore fixé, le faire "brouiller"
				if (!fixedChars[i]) {
					// Probabilité de brouillage augmente avec le temps
					const blurProb = phase * 0.5 + 0.2;

					if (Math.random() < blurProb) {
						chars[i] = getRandomChar();
					}
				}
			}

			// Supprimer les caractères excédentaires progressivement
			if (chars.length > newText.length) {
				if (animationFrame > totalFrames * 0.5 && Math.random() < 1) {
					chars.pop();
				}
			}

			// Mettre à jour le texte affiché
			animatedText.textContent = chars.join('');

			// Continuer l'animation si nécessaire
			if (animationFrame < totalFrames) {
				setTimeout(animate, frameDuration);
			} else {
				// S'assurer que le texte final est correct
				animatedText.textContent = newText;

				// Programmer la prochaine animation
				setTimeout(nextGreeting, 2500); // Attendre 3 secondes avant la prochaine transition
			}
		}

		// Démarrer l'animation
		setTimeout(animate, frameDuration);
	}

	// Fonction pour passer à la salutation suivante
	function nextGreeting() {
		// Passer à l'index suivant
		currentIndex = (currentIndex + 1) % greetings.length;

		// Animer vers le nouveau texte
		animateTextChange(greetings[currentIndex]);
	}

	// Commencer par l'animation du texte original vers la première salutation
	setTimeout(function() {
		animateTextChange(greetings[0]);
	}, 1500); // Attendre 1.5 secondes avant de commencer l'animation
});

// POUR LE THEME

document.addEventListener('DOMContentLoaded', function() {
	const themeSwitch = document.getElementById('theme-switch');

	if (themeSwitch) {
		// Check for system preference first
		const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

		// Then check if a theme is saved in localStorage
		const savedTheme = localStorage.getItem('theme');

		// Set initial theme based on: savedTheme (if exists) OR system preference
		if (savedTheme === 'dark' || (savedTheme === null && prefersDarkMode)) {
			// Dark theme
			themeSwitch.checked = false;
			document.body.classList.add('dark-theme');
		} else if (savedTheme === 'light' || (savedTheme === null && !prefersDarkMode)) {
			// Light theme
			themeSwitch.checked = true;
			document.body.classList.remove('dark-theme');
		}

		// Listen for system preference changes
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
			// Only apply system preference if user hasn't manually set a preference
			if (!localStorage.getItem('theme')) {
				if (e.matches) {
					// System switched to dark mode
					themeSwitch.checked = false;
					document.body.classList.add('dark-theme');
				} else {
					// System switched to light mode
					themeSwitch.checked = true;
					document.body.classList.remove('dark-theme');
				}
			}
		});

		// Handle theme change
		themeSwitch.addEventListener('change', function() {
			if (this.checked) {
				// Light theme
				document.body.classList.remove('dark-theme');
				localStorage.setItem('theme', 'light');
			} else {
				// Dark theme
				document.body.classList.add('dark-theme');
				localStorage.setItem('theme', 'dark');
			}
		});
	}
});

// FIX POUR iOS SAFARI ET LES HAUTEURS DE VIEWPORT

window.addEventListener('DOMContentLoaded', () => {
	// Définir la variable CSS lors du chargement initial
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh-offset', `${vh}px`);
});

// Mettre à jour la variable lors du redimensionnement
window.addEventListener('resize', () => {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh-offset', `${vh}px`);
});
