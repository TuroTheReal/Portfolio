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

// VERSION VOULU, PB AVEC LE BG des lettres

// // Animation style machine à sous avec effets de brouillage et d'opacité
// document.addEventListener('DOMContentLoaded', function() {
//	 // Vérifier si l'élément existe avant de procéder
//	 const animatedTextContainer = document.getElementById('animated-text');
//	 if (!animatedTextContainer) {
//		 console.error("L'élément avec l'ID 'animated-text' n'a pas été trouvé");
//		 return;
//	 }

//	 // Définir les salutations à afficher en rotation
//	 const greetings = ["Welcome.", "Bienvenue.", "Hello.", "Bonjour."];
//	 let currentIndex = 0;

//	 // Caractères pour l'effet de brouillage
//	 const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=";

//	 // Stocker le texte original
//	 const originalText = animatedTextContainer.textContent;

//	 // Recréer la structure pour l'animation style machine à sous
//	 animatedTextContainer.innerHTML = '';

//	 // Ajouter un effet d'opacité initial
//	 animatedTextContainer.style.opacity = '0';

//	 // Fonction pour obtenir un caractère aléatoire
//	 function getRandomChar() {
//		 return randomChars.charAt(Math.floor(Math.random() * randomChars.length));
//	 }

//	 // Fonction pour créer des spans individuels pour chaque caractère
//	 function createCharacterSpans(text) {
//		 animatedTextContainer.innerHTML = '';

//		 for (let i = 0; i < text.length; i++) {
//			 const span = document.createElement('span');
//			 span.textContent = text[i];
//			 span.style.display = 'inline-block';
//			 span.style.opacity = '0';
//			 span.style.transform = 'translateY(-20px)';
//			 span.style.transition = 'all 0.2s ease-out';
//			 animatedTextContainer.appendChild(span);
//		 }

//		 return Array.from(animatedTextContainer.children);
//	 }

//	 // Faire apparaître progressivement avec effet de machine à sous
//	 function revealWithSlotEffect(spans, targetText) {
//		 return new Promise(resolve => {
//			 // Assurer que nous avons suffisamment de spans pour le texte cible
//			 while (spans.length < targetText.length) {
//				 const span = document.createElement('span');
//				 span.textContent = ' ';
//				 span.style.display = 'inline-block';
//				 span.style.opacity = '0';
//				 span.style.transform = 'translateY(-20px)';
//				 span.style.transition = 'all 0.2s ease-out';
//				 animatedTextContainer.appendChild(span);
//				 spans.push(span);
//			 }

//			 // Réduire le nombre de spans si nécessaire
//			 while (spans.length > targetText.length) {
//				 const span = spans.pop();
//				 span.style.opacity = '0';
//				 span.style.transform = 'translateY(20px)';
//				 setTimeout(() => span.remove(), 500);
//			 }

//			 // Rendre le conteneur visible
//			 animatedTextContainer.style.opacity = '1';

//			 // Pour chaque caractère, effectuer l'animation de machine à sous
//			 let completeCount = 0;

//			 spans.forEach((span, index) => {
//				 // Délai progressif pour effet cascade
//				 const delay = index * 150 + Math.random() * 200;

//				 // Nombre d'itérations pour l'effet de roulette
//				 const iterations = 5 + Math.floor(Math.random() * 10);

//				 // Démarrer l'animation après le délai
//				 setTimeout(() => {
//					 let iteration = 0;

//					 // Fonction pour changer les caractères
//					 function changeCharacter() {
//						 iteration++;

//						 // Si nous n'avons pas terminé les itérations
//						 if (iteration < iterations) {
//							 // Caractère aléatoire
//							 span.textContent = getRandomChar();

//							 // Ajuster l'opacité progressivement
//							 span.style.opacity = Math.min(0.3 + (iteration / iterations) * 0.7, 1).toString();

//							 // Ajuster la position pour effet de défilement
//							 const posY = -20 + (iteration / iterations) * 20;
//							 span.style.transform = `translateY(${posY}px)`;

//							 // Continuer avec le prochain changement
//							 setTimeout(changeCharacter, 100 - (iteration / iterations) * 50);
//						 } else {
//							 // Fixer le caractère final
//							 span.textContent = targetText[index];
//							 span.style.opacity = '1';
//							 span.style.transform = 'translateY(0)';

//							 // Augmenter le compteur de complétion
//							 completeCount++;

//							 // Si tous les caractères sont en place, résoudre la promesse
//							 if (completeCount === spans.length) {
//								 setTimeout(resolve, 1000);
//							 }
//						 }
//					 }

//					 // Démarrer le changement de caractères
//					 changeCharacter();
//				 }, delay);
//			 });
//		 });
//	 }

//	 // Faire disparaître avec effet de machine à sous à l'envers
//	 function hideWithReverseSlotEffect(spans) {
//		 return new Promise(resolve => {
//			 let completeCount = 0;

//			 // Pour chaque caractère, effectuer l'animation inverse
//			 spans.forEach((span, index) => {
//				 // Délai progressif pour effet cascade, en ordre inverse
//				 const delay = (spans.length - index - 1) * 100;

//				 // Démarrer l'animation après le délai
//				 setTimeout(() => {
//					 // Animation d'opacité et de mouvement
//					 span.style.opacity = '0';
//					 span.style.transform = 'translateY(20px)';

//					 // Augmenter le compteur de complétion
//					 completeCount++;

//					 // Si tous les caractères sont cachés, résoudre la promesse
//					 if (completeCount === spans.length) {
//						 setTimeout(resolve, 500);
//					 }
//				 }, delay);
//			 });
//		 });
//	 }

//	 // Fonction principale d'animation
//	 async function runAnimation() {
//		 // Créer les spans pour le texte initial
//		 let spans = createCharacterSpans(originalText || greetings[0]);

//		 // Attendre un court instant avant de commencer
//		 await new Promise(resolve => setTimeout(resolve, 1000));

//		 // Boucle infinie pour l'animation
//		 while (true) {
//			 // Afficher la salutation actuelle
//			 await revealWithSlotEffect(spans, greetings[currentIndex]);

//			 // Attendre 3 secondes
//			 await new Promise(resolve => setTimeout(resolve, 3000));

//			 // Cacher les caractères
//			 await hideWithReverseSlotEffect(spans);

//			 // Passer à la salutation suivante
//			 currentIndex = (currentIndex + 1) % greetings.length;
//		 }
//	 }

//	 // Démarrer l'animation
//	 runAnimation();
// });


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