# Styled Portfolio

A personal portfolio built from scratch with React and Vite. Designed to be immersive — featuring a fully animated day/night sky, a custom CSS character loader, and a custom cursor system — while remaining fast and responsive.

---

## Live Demo

> _https://robertktoroitich.com/_

---

## Features

- **Day / Night theme** — toggle switches between a full daytime and nighttime sky scene, persisted via `localStorage` and synced to `prefers-color-scheme` on first visit
- **Animated background** — pure-CSS sky with parallax stars, shooting meteors, drifting clouds, a hot-air balloon (day), and a floating satellite (night)
- **Custom loader** — CSS-animated noodle-eating character with mouse-tracking eyes; dissolve exit is synced to the smile-peak keyframe of the animation cycle
- **Custom cursor** — context-aware cursor that switches between default, text, click, and not-allowed states; pointer-device detection prevents it rendering on touch screens
- **Scroll animations** — each section fades in on scroll via `IntersectionObserver`
- **Projects** — tabbed layout across Software, Graphic Design, 3D & CAD, and Electronics categories; sourced from a local `db.json`
- **GitHub activity calendar** — live contribution graph pulled directly from your GitHub profile
- **Contacts** — one-click copy to clipboard for email and phone, with visual confirmation feedback

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | React 19 + Vite                     |
| Animation  | Framer Motion, CSS keyframes        |
| Styling    | Plain CSS with CSS custom properties|
| Data       | Local `db.json`                     |

---

## Project Structure

```
src/
├── assets/          # Images, SVGs, icons
├── components/      # One file per UI component
│   ├── AboutMe.jsx
│   ├── Background.jsx
│   ├── Contacts.jsx
│   ├── CustomCursor.jsx
│   ├── GreetingBoy.jsx
│   ├── GithubCalendar.jsx
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
│   └── useInView.js  # Shared IntersectionObserver hook
├── data/
│   └── db.json       # Project entries
├── styles/           # Per-component CSS files
    ├── about.css
│   ├── bgandswitch.css
│   ├── contacts.css
│   ├── customcursor.css
│   ├── greetingboy.css
│   ├── githubgalendar.css
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