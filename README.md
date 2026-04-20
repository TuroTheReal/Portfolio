# Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen.svg"/>
  <img src="https://img.shields.io/badge/Updated-2026--04-blue.svg"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify&logoColor=white"/>
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
- [📝 Related Articles](#-related-articles)
- [🌐 Live](#-live)
- [📄 License](#-license)

---

## 📌 About

Bilingual (EN/FR) portfolio website showcasing my projects, skills, and professional background as a DevOps & Cloud Engineer.
Built with vanilla HTML5, CSS3, and JavaScript — no frameworks, no dependencies. Dark/light theme, fully responsive, deployed on Netlify.

### Tech Stack

| Component | Technology |
|-----------|------------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (Grid, Flexbox, custom properties, transitions) |
| Scripting | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts (Poppins, DM Sans) |
| Hosting | Netlify |
| Analytics | Google Analytics (gtag.js) |
| Design | Figma |

---

## 📁 Project Structure

```
Portfolio/
├── assets/
│   ├── css/
│   │   ├── style.css          # Main stylesheet (variables, layout, components)
│   │   ├── blog.css           # Blog listing & article styles
│   │   ├── resume.css         # Resume/CV page styles
│   │   └── tech-radar.css     # Tech Radar listing & edition styles
│   ├── img/                   # Images (og-image.webp, PhotoPro)
│   │   ├── projects/          # Project screenshots (dark + light variants)
│   │   └── blog/              # Blog article images
│   ├── link/
│   │   └── Arthur_Bernard_CV.pdf
│   └── script.js              # Burger menu, scroll, theme/lang toggle, observers
├── en/
│   ├── index.html             # Homepage — English
│   ├── resume.html            # Resume/CV — English
│   ├── blog/                  # Blog articles + index — English
│   └── tech-radar/            # Tech Radar listing & editions — English
├── fr/
│   ├── index.html             # Homepage — French
│   ├── resume.html            # Resume/CV — French
│   ├── blog/                  # Blog articles + index — French
│   └── tech-radar/            # Tech Radar listing & editions — French
├── index.html                 # Root redirect (lang detection → /en/ or /fr/)
├── _redirects                 # Netlify 301 redirects (old URLs → new folder-based)
├── netlify.toml               # Netlify build config + redirects
├── sitemap.xml                # SEO sitemap with hreflang
├── robots.txt                 # Crawler rules + AI bot blocking
├── llms.txt                   # AI crawler instructions (LLM-oriented summary)
├── humans.txt                 # Human-readable site credits
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
open en/index.html

# Or serve locally
python3 -m http.server 8080
# Then visit http://localhost:8080/en/
```

---

## 📖 Features

- **Bilingual** — Full EN/FR versions with folder-based i18n (`/en/`, `/fr/`), seamless language switching (preserves scroll position)
- **Dark/Light theme** — Toggle with localStorage persistence, separate color palettes (AAA contrast)
- **Responsive** — Mobile-first design with slide panel menu, tablet grid, desktop navigation
- **Blog** — Bilingual articles with tag-based filtering, category system
- **Tech Radar** — Weekly tech watch with category filters, edition navigation, automated via [weekly-tech-radar](https://github.com/TuroTheReal/weekly-tech-radar) pipeline
- **Smooth scroll** — Variable speed easeInOutCubic scroll-to-section on filter/nav clicks
- **Smooth animations** — Scroll-based fade-in (IntersectionObserver), animated mesh gradient blobs, hover effects
- **Active nav tracking** — Ratio-based IntersectionObserver highlights current section
- **Auto-hide header** — Header hides on scroll down, reveals on scroll up (mobile only)
- **Resume/CV page** — Downloadable PDF, responsive grid layout, animated link underlines
- **Performance** — No dependencies, no build step, Google Fonts CDN, lazy-loaded images
- **SEO optimized** — Sitemap with hreflang, robots.txt, Open Graph, Twitter Cards, JSON-LD (Person, BlogPosting, BreadcrumbList, ProfilePage)
- **AI-friendly** — `llms.txt` instructions + structured data for ChatGPT, Perplexity, Google AI Overview
- **Accessibility** — Semantic HTML, ARIA labels, prefers-reduced-motion support

---

## 📝 Related Articles

The blog hosted on this portfolio documents the DevOps/Cloud learning journey behind it:

- 📝 [Blog — English](https://arthur-portfolio.com/en/blog) — All articles (EN)
- 📝 [Blog — Français](https://arthur-portfolio.com/fr/blog) — Tous les articles (FR)

Featured posts:

- 📝 [My DevOps/Cloud Engineer Roadmap](https://arthur-portfolio.com/en/blog/devops-roadmap) — 6-month plan from 42 to DevOps/Cloud
- 📝 [Building a Learning System with Obsidian + Claude](https://arthur-portfolio.com/en/blog/obsidian-claude-learning-system) — Personal knowledge vault setup
- 📝 [AWS + Terraform + Ansible: Infrastructure as Code](https://arthur-portfolio.com/en/blog/aws-terraform-ansible) — Deep dive on IaC automation
- 📝 [Landing a DevOps Internship at Alan](https://arthur-portfolio.com/en/blog/landing-alan-internship) — Interview process and feedback

---

## 🌐 Live

**[arthur-portfolio.com](https://arthur-portfolio.com)**

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
