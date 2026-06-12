# JavaScript Learning Path

[English](README.md) | [简体中文](README_zh.md)

---

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![VitePress](https://img.shields.io/badge/docs-VitePress-646cff.svg)](https://vitepress.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg)](https://vitejs.dev/)

> A progressive, project-driven JavaScript learning path — from zero to modern frontend development, with 24 hands-on projects and a VitePress documentation site.

---

> ⚠️ **Disclaimer**: This project and its documentation were generated with the assistance of AI. The content is provided for reference and learning purposes only. Please verify and adapt the code to your own needs before using it in production.

---

## Table of Contents

- [Introduction](#introduction)
- [Learning Roadmap](#learning-roadmap)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Course Overview](#course-overview)
  - [Phase 1: Beginner](#phase-1-beginner)
  - [Phase 2: Intermediate](#phase-2-intermediate)
  - [Phase 3: Advanced](#phase-3-advanced)
  - [Phase 4: Vite Projects](#phase-4-vite-projects)
- [Documentation Site](#documentation-site)
- [License](#license)

## Introduction

This repository is a structured JavaScript learning path designed for absolute beginners. It contains **24 projects** organized into 4 progressive phases, covering everything from basic DOM manipulation to modern frontend tooling with Vite, TypeScript, and Vue 3.

**Key features:**

- **Zero to advanced** — starts with `getElementById`, ends with Vue 3 + Pinia
- **Project-driven** — every concept is taught through a working project
- **No build tools required for early phases** — just double-click `index.html`
- **Detailed Chinese comments** — every line of code is explained
- **Challenge tasks** — each project includes easy / medium / hard challenges
- **VitePress documentation site** — searchable, dark mode, mobile-friendly

## Learning Roadmap

```
Phase 1: Beginner (01-beginner/)          → Core syntax & DOM manipulation
         ↓
Phase 2: Intermediate (02-intermediate/)   → Modern JS features (ES6+)
         ↓
Phase 3: Advanced (03-advanced/)           → Real-world projects (Canvas, Node.js, WebExtensions)
         ↓
Phase 4: Vite Projects (04-vite-projects/) → Modern toolchain (Vite, TypeScript, Vue 3)
```

## Quick Start

### Browser Projects (Phase 1 & 2)

No installation needed — just open the HTML file:

```bash
# Open any project
cd 01-beginner/01-todo-list
# Double-click index.html, or:
npx serve .
```

### Node.js Projects (Phase 3)

```bash
cd 03-advanced/06-express-api-server
npm install
npm start
```

### Vite Projects (Phase 4)

```bash
cd 04-vite-projects/03-vite-vue-app
npm install
npm run dev
```

### Documentation Site

```bash
npm install
npm run docs:dev      # Start dev server at localhost:5173
npm run docs:build    # Build static site
npm run docs:preview  # Preview production build
```

## Project Structure

```
javascript-learn/
├── 01-beginner/              # Phase 1: 7 beginner projects
│   ├── 01-todo-list/         #   DOM, events, arrays
│   ├── 02-calculator/        #   Functions, validation
│   ├── 03-guess-game/        #   Math.random, loops
│   ├── 04-weather-simulator/ #   Objects, JSON
│   ├── 05-digital-clock/     #   setInterval, Date
│   ├── 06-array-playground/  #   map/filter/reduce
│   └── 07-form-validator/    #   RegExp, events
│
├── 02-intermediate/          # Phase 2: 6 ES6+ feature demos
│   ├── 01-arrow-functions/   #   this binding, syntax
│   ├── 02-destructuring/     #   Array/object destructuring
│   ├── 03-template-literals/ #   String interpolation
│   ├── 04-promises-async/    #   Async/await, fetch
│   ├── 05-es-modules/        #   import/export
│   └── 06-optional-chaining/ #   ?. and ?? operators
│
├── 03-advanced/              # Phase 3: 8 advanced projects
│   ├── 01-particle-animation/  # Canvas, requestAnimationFrame
│   ├── 02-node-cli-tool/       # Node.js, fs, path
│   ├── 03-markdown-editor/     # Custom parser, LocalStorage
│   ├── 04-tampermonkey-script/ # UserScript API
│   ├── 05-sort-visualizer/     # Algorithms + animation
│   ├── 06-express-api-server/  # Express, REST API, middleware
│   ├── 07-websocket-chat/      # WebSocket, real-time
│   └── 08-database-crud/       # SQLite, better-sqlite3
│
├── 04-vite-projects/         # Phase 4: 3 Vite-based projects
│   ├── 01-vite-vanilla-app/  # Vite + vanilla JS
│   ├── 02-vite-ts-starter/   # Vite + TypeScript
│   └── 03-vite-vue-app/      # Vite + Vue 3 + Router + Pinia
│
├── docs/                     # VitePress documentation site
│   ├── .vitepress/config.mts # Site configuration
│   ├── index.md              # Homepage
│   ├── guide/                # Learning roadmap & setup
│   ├── beginner/             # Phase 1 docs
│   ├── intermediate/         # Phase 2 docs
│   ├── advanced/             # Phase 3 docs
│   └── vite-projects/        # Phase 4 docs
│
├── .github/workflows/        # GitHub Pages auto-deploy
├── package.json              # VitePress dependency
├── LICENSE                   # GPL v3
└── README.md
```

## Course Overview

### Phase 1: Beginner

All projects run directly in the browser — no build tools, no npm.

| # | Project | Key Concepts |
|---|---------|-------------|
| 01 | Interactive Todo List | DOM manipulation, event listeners, array CRUD |
| 02 | Simple Calculator | Function encapsulation, input validation, error handling |
| 03 | Guess the Number | Math.random(), loops, conditionals |
| 04 | Weather Simulator | Objects, JSON, data rendering |
| 05 | Digital Clock | setInterval, Date formatting |
| 06 | Array Playground | map / filter / reduce / sort / find |
| 07 | Form Validator | Regular expressions, event handling |

### Phase 2: Intermediate

Modern JavaScript features with interactive demos.

| # | Topic | Key Concepts |
|---|-------|-------------|
| 01 | Arrow Functions | `this` binding, syntax comparison |
| 02 | Destructuring | Array/object destructuring, default values |
| 03 | Template Literals | String interpolation, multiline strings |
| 04 | Promises & async/await | Async programming, fetch API |
| 05 | ES Modules | import / export, module system |
| 06 | Optional Chaining | `?.` and `??` operators |

### Phase 3: Advanced

Real-world projects including Node.js backend development.

| # | Project | Tech Stack |
|---|---------|-----------|
| 01 | Particle Animation | Canvas 2D, requestAnimationFrame, OOP |
| 02 | Node.js CLI Tool | fs, path, process (zero dependencies) |
| 03 | Markdown Editor | Custom parser, LocalStorage, DOM |
| 04 | Tampermonkey Script | UserScript API, MutationObserver |
| 05 | Sort Visualizer | 4 sorting algorithms, async/await animation |
| 06 | Express RESTful API | Express, routing, middleware |
| 07 | WebSocket Chat | ws, event-driven, real-time communication |
| 08 | SQLite CRUD | better-sqlite3, SQL, CLI & HTTP modes |

### Phase 4: Vite Projects

Modern frontend toolchain with Vite.

| # | Project | Tech Stack |
|---|---------|-----------|
| 01 | Vite Vanilla App | Vite, ESBuild, HMR |
| 02 | Vite + TypeScript | TypeScript, type system, generics |
| 03 | Vite + Vue 3 | Vue 3, Composition API, Vue Router, Pinia |

## Documentation Site

This project includes a full documentation site built with [VitePress](https://vitepress.dev/).

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

The site features:
- 🌐 Chinese documentation for all 24 projects
- 🔍 Full-text search
- 🌙 Dark mode
- 📱 Mobile responsive
- 🚀 GitHub Pages auto-deployment via GitHub Actions

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

```
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```
