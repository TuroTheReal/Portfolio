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

// Liste des textes à afficher
// const texts = ["Welcome.", "Bienvenue.", "Hello.", "Bonjour."];
// let currentIndex = 0;
// const textContainer = document.getElementById('animated-text');

// // Ne continuer que si l'élément existe (pour éviter les erreurs sur les autres pages)
// if (textContainer) {
//     /**
//      * Retourne un caractère aléatoire parmi une liste.
//      */
//     function randomChar() {
//         const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&#\"\'\\^$=)°][}{`|~,?;.:/!§><'{";
//         return chars.charAt(Math.floor(Math.random() * chars.length));
//     }

//     /**
//      * Anime l'apparition du texte tout en préservant l'effet de gradient.
//      */
//     function animateText(element, finalText) {
//         // Set the data-text attribute for the ::before pseudo-element
//         element.setAttribute('data-text', finalText);

//         // Clear the element
//         element.innerHTML = '';

//         // Create each letter
//         const letters = finalText.split('');
//         letters.forEach(letter => {
//             const span = document.createElement('span');
//             span.classList.add('letter');
//             span.dataset.final = letter;
//             span.textContent = letter === ' ' ? '\u00A0' : ''; // espace insécable pour les espaces
//             element.appendChild(span);

//             // Délai d'animation aléatoire (jusqu'à 1 seconde)
//             const delay = Math.random() * 1000;
//             span.style.animationDelay = `${delay}ms`;

//             // Lancement de l'effet scramble après le délai
//             setTimeout(() => {
//                 let iterations = 10; // Nombre de cycles de scramble
//                 const interval = setInterval(() => {
//                     if (iterations <= 0) {
//                         clearInterval(interval);
//                         span.textContent = letter === ' ' ? '\u00A0' : letter; // Affiche la lettre finale
//                     } else {
//                         span.textContent = letter === ' ' ? '\u00A0' : randomChar();
//                         iterations--;
//                     }
//                 }, 75); // Intervalle entre chaque changement
//             }, delay);
//         });
//     }

//     // Animation initiale
//     animateText(textContainer, texts[currentIndex]);

//     // Changement de texte toutes les 4 secondes avec animation
//     setInterval(() => {
//         currentIndex = (currentIndex + 1) % texts.length;
//         animateText(textContainer, texts[currentIndex]);
//     }, 4000);
// }






// POUR LE TEXTE PAGE WELCOME

// // Liste des textes à afficher
// const texts = ["Welcome.", "Bienvenue.", "Hello.", "Bonjour."];
// let currentIndex = 0;
// const textContainer = document.getElementById('animated-text');

// // Ne continuer que si l'élément existe (pour éviter les erreurs sur les autres pages)
// if (textContainer) {
//     // Créer la couche d'animation blanche sous le texte en dégradé
//     const animationLayer = document.createElement('div');
//     animationLayer.id = 'animation-layer';
//     textContainer.parentNode.appendChild(animationLayer);

//     /**
//      * Retourne un caractère aléatoire parmi une liste.
//      */
//     function randomChar() {
//         const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&#\"\'\\^$=)°][}{`|~,?;.:/!§><'{";
//         return chars.charAt(Math.floor(Math.random() * chars.length));
//     }

//     /**
//      * Anime l'apparition du texte avec un effet de scramble sur la couche blanche,
//      * tandis que le texte en dégradé reste statique au-dessus.
//      */
//     function animateText(finalText) {
//         // Mettre à jour le texte en dégradé (couche supérieure)
//         textContainer.textContent = finalText;

//         // Réinitialiser la couche d'animation
//         animationLayer.innerHTML = '';

//         // Créer chaque lettre pour l'animation
//         const letters = finalText.split('');
//         letters.forEach(letter => {
//             const span = document.createElement('span');
//             span.classList.add('letter');
//             span.dataset.final = letter;
//             span.textContent = letter === ' ' ? '\u00A0' : ''; // espace insécable pour les espaces
//             animationLayer.appendChild(span);

//             // Délai d'animation aléatoire (jusqu'à 1 seconde)
//             const delay = Math.random() * 1000;
//             span.style.animationDelay = `${delay}ms`;

//             // Lancement de l'effet scramble après le délai
//             setTimeout(() => {
//                 let iterations = 10; // Nombre de cycles de scramble
//                 const interval = setInterval(() => {
//                     if (iterations <= 0) {
//                         clearInterval(interval);
//                         span.textContent = letter === ' ' ? '\u00A0' : letter; // Affiche la lettre finale
//                     } else {
//                         span.textContent = letter === ' ' ? '\u00A0' : randomChar();
//                         iterations--;
//                     }
//                 }, 75); // Intervalle entre chaque changement
//             }, delay);
//         });
//     }

//     // Animation initiale
//     animateText(texts[currentIndex]);

//     // Changement de texte toutes les 4 secondes avec animation
//     setInterval(() => {
//         currentIndex = (currentIndex + 1) % texts.length;
//         animateText(texts[currentIndex]);
//     }, 4000);
// }










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