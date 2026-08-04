# Styled Portfolio
A personal portfolio built from scratch with React and Vite. Designed to be immersive — featuring a fully animated day/night sky, an interactive 3D globe — while remaining fast and responsive through aggressive code-splitting.

---

## Live Demo
> _https://robertktoroitich.com/_

---

## Features
- **Day / Night theme** — toggle switches between a full daytime and nighttime sky scene, persisted via `localStorage` and synced to `prefers-color-scheme` on first visit; an inline pre-hydration script also sets the correct background color before React mounts, avoiding a flash of the wrong theme
- **Animated background** — pure-CSS sky with parallax stars, shooting meteors, drifting clouds, a hot-air balloon (day), and a floating satellite (night)
- **Scroll animations** — each section fades in on scroll via a shared `useInView` IntersectionObserver hook
- **Projects** — tabbed layout across Software Engineering, Graphic Design, 3D & CAD Design, and Electronics; sourced from a local `db.json`, with a "Coming soon" placeholder card shown for any category without entries yet
- **Interactive 3D contact globe** — a WebGL globe (Three.js + `@react-three/fiber` + `three-globe`) rendered inside the Contacts section, showing animated arcs radiating from Nakuru, Kenya to cities around the world; lazy-mounted only once it nears the viewport so its ~2-3 MB chunk never competes with first-paint assets
- **WhatsApp-relayed contact form** — a name/email/message form that opens a pre-filled `wa.me` link instead of requiring a backend
- **One-click contact copy** — clipboard copy for email, with tap-to-call for phone and direct links out to LinkedIn/GitHub
- **Performance-first loading** — route-level `lazy()` + `Suspense` for every non-critical section, a manual preload pass for lighter chunks, and a scroll-proximity `LazyMount` wrapper that defers the heavy globe chunk until it's actually needed
- **Vercel Analytics & Speed Insights** — lazy-loaded alongside the rest of the app for real-world traffic and performance monitoring

---

## Tech Stack
| Layer      | Technology                                              |
|------------|----------------------------------------------------------|
| Framework  | React 19 + Vite                                          |
| Animation  | Framer Motion, CSS keyframes                             |
| 3D / WebGL | Three.js, `@react-three/fiber`, `@react-three/drei`, `three-globe` |
| Styling    | Plain CSS with CSS custom properties                     |
| Data       | Local `db.json` (projects), `public/data/globe.json` (globe world data) |
| Monitoring | Vercel Analytics, Vercel Speed Insights                  |

---

## Project Structure
```
public/
├── data/
│   └── globe.json           # World map data for the 3D globe
└── images/                  # Project showcase images (webp)

src/
├── assets/                  # Icons, logos, emoji, cursor SVGs
├── components/               # One file per UI component
│   ├── AboutMe.jsx
│   ├── Background.jsx
│   ├── CardStack.jsx
│   ├── ContactForm.jsx
│   ├── Contacts.jsx
│   ├── GithubCalendar.jsx
│   ├── GlareWrapper.jsx
│   ├── Globe.jsx             # 3D contact globe (Three.js / three-globe)
│   ├── GreetingBoy.jsx
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Loader.jsx
│   ├── Navbar.jsx
│   ├── Projects.jsx
│   ├── ShowcaseCard.jsx
│   ├── Skills.jsx
│   ├── SkillsMarquee.jsx
│   └── ThemeButton.jsx
├── hooks/
│   └── useInView.js          # Shared IntersectionObserver hook
├── data/
│   ├── db.json                # Project entries
│   └── earth-dark.jpg         # Globe texture
├── styles/                    # Per-component CSS files
│   ├── about.css
│   ├── bgandswitch.css
│   ├── cardstack.css
│   ├── contacts.css
│   ├── githubcalendar.css
│   ├── glarewrapper.css
│   ├── globe.css
│   ├── greetingboy.css
│   ├── hero.css
│   ├── loader.css
│   ├── navbar.css
│   ├── projects.css
│   ├── showcasecard.css
│   └── skills.css
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## Getting Started
```bash
git clone https://github.com/RobertTRL/Styled-Portfolio.git
cd Styled-Portfolio
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Author
**Robert Toroitich** — Full-Stack Developer & Graphic Designer
[LinkedIn](https://www.linkedin.com/in/robert-toroitich-82b24639a/) · [GitHub](https://github.com/RobertTRL)