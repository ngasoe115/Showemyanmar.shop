# 🇲🇲 Showemyanmar.shop

A modern e-commerce frontend for discovering and shopping authentic Myanmar products, traditional crafts, gems, and cultural items — built with **React**, **Vite**, and **Tailwind CSS v4**.

## Features

- 🏠 **Home** — Hero section, category highlights, featured products, and a CTA banner
- 🛍️ **Products** — Full product catalog with search and category filtering
- 📖 **About** — Mission, values, stats, and team section
- 📬 **Contact** — Contact information and a message form

## Tech Stack

| Tool | Version |
|---|---|
| [React](https://react.dev/) | 19 |
| [Vite](https://vite.dev/) | 8 |
| [React Router](https://reactrouter.com/) | 7 |
| [Tailwind CSS](https://tailwindcss.com/) | 4 |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run the linter (oxlint) |

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx      # Responsive navigation bar
│   ├── Footer.jsx      # Site footer with links
│   └── ProductCard.jsx # Reusable product card
├── pages/
│   ├── Home.jsx        # Landing page
│   ├── Products.jsx    # Product catalog with filters
│   ├── About.jsx       # About us page
│   └── Contact.jsx     # Contact form & info
├── data/
│   └── products.js     # Mock product data
├── App.jsx             # Root component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles + Tailwind
```
