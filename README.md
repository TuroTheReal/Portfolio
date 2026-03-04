# Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen.svg"/>
  <img src="https://img.shields.io/badge/Updated-2026--03-blue.svg"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-green.svg"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg"/>
</p>

<p align="center">
  <i>Personal portfolio website — DevOps & Cloud Engineer</i>
</p>

---

## 📑 Table of Contents

- [📌 About](#-about)
- [📁 Project Structure](#-project-structure)
- [✅ Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [📖 Features](#-features)
- [🌐 Live](#-live)
- [📄 License](#-license)

---

## 📌 About

Bilingual (EN/FR) portfolio website showcasing my projects, skills, and professional background as a DevOps & Cloud Engineer.
Built with vanilla HTML5, CSS3, and JavaScript — no frameworks, no dependencies. Dark/light theme, fully responsive, deployed on GitHub Pages.

### Tech Stack

| Component | Technology |
|-----------|------------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (Grid, Flexbox, custom properties, transitions) |
| Scripting | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts (Poppins, DM Sans) |
| Hosting | GitHub Pages |
| Analytics | Google Analytics (gtag.js) |
| Design | Figma |

---

## 📁 Project Structure

```
Portfolio/
├── assets/
│   ├── css/
│   │   ├── style.css          # Main stylesheet (variables, layout, components)
│   │   └── resume.css         # Resume/CV page styles
│   ├── illu/                  # Project illustrations (dark + light variants)
│   ├── link/
│   │   └── Arthur_Bernard_CV.pdf
│   └── script.js              # Burger menu, scroll, theme/lang toggle, observers
├── index_en.html              # Homepage — English
├── index_fr.html              # Homepage — French
├── resume_en.html             # Resume/CV — English
├── resume_fr.html             # Resume/CV — French
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

None. Static site — just a browser.

For local development:

| Requirement | Notes |
|-------------|-------|
| Any modern browser | Chrome, Firefox, Safari, Edge |
| Local server (optional) | `python3 -m http.server` or VS Code Live Server |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/TuroTheReal/Portfolio.git
cd Portfolio

# Open directly
open index_en.html

# Or serve locally
python3 -m http.server 8080
# Then visit http://localhost:8080/index_en.html
```

---

## 📖 Features

- **Bilingual** — Full EN/FR versions with seamless language switching (preserves scroll position)
- **Dark/Light theme** — Toggle with localStorage persistence, separate color palettes
- **Responsive** — Mobile-first design with slide panel menu, tablet grid, desktop navigation
- **Smooth animations** — Scroll-based fade-in (IntersectionObserver), animated mesh gradient blobs, hover effects
- **Active nav tracking** — Ratio-based IntersectionObserver highlights current section
- **Auto-hide header** — Header hides on scroll down, reveals on scroll up (mobile only)
- **Resume/CV page** — Downloadable PDF, responsive grid layout, animated link underlines
- **Performance** — No dependencies, no build step, Google Fonts CDN, lazy-loaded images
- **Accessibility** — Semantic HTML, ARIA labels, prefers-reduced-motion support

---

## 🌐 Live

**[turothereal.github.io/Portfolio](https://turothereal.github.io/Portfolio/)**

---

## 📄 License

This project is open source under the **MIT License** — feel free to use it as inspiration for your own portfolio.

If you found this useful, consider giving it a ⭐ — it's always appreciated!

---

<p align="center">
  <b>Arthur Bernard</b> — DevOps & Cloud Engineer
  <br>
  <a href="https://www.linkedin.com/in/arthurbernard92/">LinkedIn</a> · <a href="https://github.com/TuroTheReal">GitHub</a> · <a href="mailto:arthurbernard.dev@gmail.com">Email</a>
</p>
