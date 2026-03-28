# Growth Loop Portfolio — PM Case Study

A full-stack, interactive PM Portfolio web application presenting a **Growth Loop Design for a B2C App** as a live, data-rich dashboard.

## Tech Stack

- **Frontend:** React + Tailwind CSS + Recharts
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3) — mock data seeded on first run

## Setup & Run

```bash
# Install all dependencies
npm run install:all

# Start both server and client (concurrent)
npm run dev
```

The app will be available at `http://localhost:5173` (frontend) with API on port `3001`.

## Tab Overview

| Tab | Description |
|-----|-------------|
| **Executive Summary** | Hero KPIs, problem/hypothesis statements, project phase table, PDF download |
| **Acquisition Funnel** | Funnel visualization, channel breakdown with LTV:CAC color coding, leaky bucket insight |
| **Growth Loop Designer** | Interactive SVG loop diagram, 4 component detail cards, live K-factor calculator with sliders |
| **Referral Mechanics** | Referral economics calculator, program design table, fraud risk framework |
| **Cohort Analysis** | Retention curves, LTV curves (referred vs paid), cohort comparison table, insight cards |
| **LTV:CAC Model** | Interactive calculator with baseline vs loop comparison, scenario table, payback period chart |
| **Roadmap & Metrics** | CSS Gantt chart (clickable phases), metrics framework, A/B test designs, risk register |

## Features

- All interactive calculators persist values to SQLite via REST API
- Responsive design with mobile-friendly layout
- Print-optimized CSS for PDF export
- Floating "Portfolio Context" modal with project background
- Skeleton loaders for graceful loading states
- Color-coded metrics and KPIs throughout

## Author

Built by **Nikunj Tandan** as a product management portfolio piece.
