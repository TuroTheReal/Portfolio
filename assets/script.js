// POUR LE SCROLL

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
});




// POUR PAGE WELCOME ET GESTION DE LA LANGUE

document.addEventListener('DOMContentLoaded', () => {
	const userLang = navigator.language || navigator.userLanguage;

	// Gestion du changement de langue via le bouton
	const langSwitch = document.getElementById('lang-switch');
	if (langSwitch) {
		// Détecter la page actuelle et mettre à jour l'état du bouton
		const currentURL = window.location.pathname;
		if (currentURL.includes('fr.html')) {
			langSwitch.checked = true;
		} else if (currentURL.includes('en.html')) {
			langSwitch.checked = false;
		}

		// Ajouter l'événement de changement pour la redirection
		langSwitch.addEventListener('change', function() {
			if (this.checked) {
				window.location.href = 'fr.html';
			} else {
				window.location.href = 'en.html';
			}
		});
	}
});







// POUR LE TEXTE PAGE WELCOME











// POUR LE THEME

document.addEventListener('DOMContentLoaded', function() {
	const themeSwitch = document.getElementById('theme-switch');

	if (themeSwitch) {
		// Vérifier si un thème est déjà enregistré dans localStorage
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'dark') {
			themeSwitch.checked = false;
			document.body.classList.add('dark-theme');
		}

		// Gestion du changement de thème
		themeSwitch.addEventListener('change', function() {
			if (this.checked) {
				// Thème clair
				document.body.classList.remove('dark-theme');
				localStorage.setItem('theme', 'light');
			} else {
				// Thème sombre
				document.body.classList.add('dark-theme');
				localStorage.setItem('theme', 'dark');
			}
		});
	}
});