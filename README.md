# Ledger — Personal finance dashboard

A production-style **single-page application** for exploring income, spending, and cash-flow signals. Built with **React 19** and **Vite**, it runs entirely in the browser: data is **seeded and persisted locally** (no backend), with an optional **admin / viewer** role switch to demonstrate permission-aware UI.

---

## Table of contents

1. [Highlights](#highlights)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Scripts](#scripts)
5. [Application map](#application-map)
6. [Data model & calculations](#data-model--calculations)
7. [State & persistence](#state--persistence)
8. [Project structure](#project-structure)
9. [Assumptions & limitations](#assumptions--limitations)
10. [Quality & accessibility](#quality--accessibility)

---

## Highlights

| Area | What you get |
|------|----------------|
| **Dashboard** | Overview cards (available funds, income, expenses, net) with **month-over-month % trends** when two months exist; **balance trend** chart (month-end balance); **spending by category** donut for the **latest month with activity**; **recent transactions** (short preview of the latest three, with **View all** to the ledger). |
| **Transactions** | Sortable, filterable table (**date / amount / category**; **asc / desc**); search across category, note, and type; **CSV** and **JSON** export of the current filtered view; **admin** can add, edit, and delete rows (with confirm); **viewer** is read-only. |
| **Insights** | Dedicated analytics view: **net after spending** for the latest month, **spending vs last month**, **category split** (donut + narrative), **spending-over-time** bar chart with comparison rows, **financial health** panel (savings status, streaks, savings rate, income, averages, pay change vs prior month, etc.) with short copy. |
| **UX** | **Dark / light** theme (persisted); responsive layout (including stacked metric rows on small screens); side navigation with **collapse** and mobile overlay; empty states when data or filters yield no rows. |

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | **React 19**, **React Router 7** |
| Build | **Vite 8**, **@vitejs/plugin-react**, React Compiler (Babel) |
| Charts | **Recharts 3** |
| Icons | **Lucide React** |
| State | **Zustand 5** + `persist` middleware → `localStorage` |
| Linting | **ESLint 9** (React Hooks + Refresh) |

---

## Getting started

**Prerequisites:** Node.js **20+** (LTS recommended) and npm.

```bash
git clone https://github.com/akash768145s/finance-dashboard-ui
cd dashboard
npm install
npm run dev
```

Open the URL Vite prints (typically **http://localhost:5173**).

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Optimized production build → `dist/` |
| `npm run preview` | Serve `dist/` locally to verify the build |
| `npm run lint` | Run ESLint on the project |

---

## Application map

Routes are declared in `src/App.jsx`:

| Path | View |
|------|------|
| `/` | Dashboard (overview + charts + recent activity) |
| `/transactions` | Full transaction ledger and controls |
| `/insights` | Multi-panel insights layout |

Global chrome: **header** (brand, role, theme), **side navigation**, **footer**.

---

## Data model & calculations

- **Currency:** USD, formatted with `Intl.NumberFormat`.
- **Transactions:** Positive amounts with a **`type`** of `income` or `expense`; optional **note**; **category** from the seeded vocabulary in `src/data/mockData.js`.
- **Available balance:** `openingBalance + Σ(income) − Σ(expense)` over all stored transactions (see `useSummary` in `src/hooks/useFinanceMetrics.js`).
- **Month boundaries:** Rollups use calendar **`yyyy-mm`** keys derived from ISO dates (`src/utils/format.js`).
- **Shared balance math:** `balanceBeforeMonth` and `balanceAtEndOfMonth` in `src/utils/financeAggregates.js` keep **dashboard charts** and **insights tooltips** aligned on the same running-balance rules.

Insights such as “latest month,” “previous month,” category totals for the latest month, and health metrics are centralized in **`useInsights()`** so the UI stays consistent.

---

## State & persistence

`src/store/useFinanceStore.js` holds:

- Transactions, opening balance  
- Role (`admin` \| `viewer`), theme (`light` \| `dark`)  
- Transaction filters, search, sort  

**Persisted** to `localStorage` under the key **`finance-dashboard`**: transactions, opening balance, role, theme. **Filters and search reset** on reload by design so each session starts with a clean table scope.

---

## Project structure

```
dashboard/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Brand / images
│   ├── components/
│   │   ├── Base/           # Header, Footer, ThemeSync, ConfirmDialog
│   │   ├── Dashboard/      # Overview, charts, recent list
│   │   ├── Insights/       # Insights page + spending breakdown
│   │   └── Transactions/   # Table, modal, filters, export
│   ├── data/
│   │   └── mockData.js     # Seed data + demo helpers
│   ├── hooks/
│   │   └── useFinanceMetrics.js   # Selectors & derived metrics
│   ├── store/
│   │   └── useFinanceStore.js     # Zustand store + persistence
│   ├── styles/             # Feature CSS (dashboard, insights, …)
│   ├── utils/
│   │   ├── format.js       # Dates, currency, labels
│   │   └── financeAggregates.js   # Balance-at-month utilities
│   ├── App.jsx             # Routes + shell layout
│   ├── dashboard.css       # App shell imports
│   └── main.jsx            # Entry
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Assumptions & limitations

- **No API:** All data is local; persistence is per-browser.
- **Demo roles:** Authorization is UI-only (no server enforcement).
- **Single currency:** Multi-currency and tax rules are out of scope.
- **Opening balance** is editable only through persisted state / seed; there is no separate “accounts” model.

These boundaries keep the scope focused on **clear UX**, **consistent aggregates**, and a **maintainable** React codebase suitable for portfolio or coursework submission.

---

## Quality & accessibility

- Semantic sections and headings; **ARIA** labels on icon-only controls (e.g. nav toggle, theme).
- **Keyboard-friendly** patterns where applicable (dialogs, forms).
- **ESLint** configured for React and hooks; run `npm run lint` before submission or CI.

---

## Author & license

This repository is marked **private** in `package.json`. Replace this section with your name, course, and license if you publish or submit formally.

---

*Ledger — a focused finance dashboard demo: one ledger, consistent math, and a full path from overview to transactions to insights.*
