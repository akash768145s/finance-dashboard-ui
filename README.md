# Ledger — Finance Dashboard UI

**Submission for:** Zorvyn · **Finance Dashboard UI** · Frontend Developer Intern  
**Author:** Akash SakthiMurugan · sakthimuruganakash@gmail.com  

A **React + Vite** finance dashboard for tracking summary balances, transactions, and spending patterns. The app is **frontend-only** with **mock data** and **local persistence**, matching the assignment scope (not production-ready, no backend).

**Repository:** [github.com/akash768145s/finance-dashboard-ui](https://github.com/akash768145s/finance-dashboard-ui)  
**Live demo:** [finance-dashboard-akash.vercel.app](https://finance-dashboard-akash.vercel.app/)

---

## Assignment requirements — how this project maps

| # | Requirement | Implementation |
|---|----------------|------------------|
| **1** | **Dashboard overview** — summary cards (balance, income, expenses); time-based viz; categorical viz | **Available funds**, **total income**, **total expenses**, **net cash flow** with MoM % hints where data allows; **balance trend** (month-end balance over time); **spending by category** donut (**latest month with activity**). |
| **2** | **Transactions** — date, amount, category, type; filtering; sorting or search | Full table with **date, amount, category, type, note**; **category & type filters**, **search** (category / note / type), **sort** by date, amount, or category (asc/desc). |
| **3** | **Role-based UI (simulated)** — viewer read-only; admin add/edit; switch in UI | **Header role dropdown:** **Viewer** = read-only; **Admin** = add / edit / delete (with confirm). No server RBAC. |
| **4** | **Insights** — highest spending category, monthly comparison, useful observations | Dedicated **`/insights`** route: top category / split, **spending over time** + this vs last month, **financial health** metrics and short narrative copy. |
| **5** | **State management** — transactions, filters, role | **Zustand** store: transactions, opening balance, role, theme, filters, search, sort; derived metrics in **`useFinanceMetrics`**. |
| **6** | **UI / UX** — clean, responsive, empty states | **Dark/light** theme, **responsive** layout (e.g. stacked metric rows on small screens), **empty states** for no data / no filter results. |

### Optional enhancements included

- **Dark mode** (persisted)  
- **localStorage** persistence (transactions, opening balance, role, theme)  
- **Export** filtered transactions as **CSV** or **JSON**  
- **Animations / transitions** (e.g. insights panel reveals)  
- *Mock API:* not used — data is static seed + store (acceptable per brief)

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
| **Dashboard** | Overview cards with **month-over-month %** where two months exist; **balance trend** chart; **spending breakdown** donut (latest active month); **recent transactions** preview (latest three) + link to full ledger. |
| **Transactions** | Sortable, filterable table; **CSV / JSON** export of the current view; **admin** CRUD; **viewer** read-only. |
| **Insights** | Net vs spending signals, category split, bar chart over months, comparison rows, **financial health** panel + microcopy. |
| **Shell** | Side nav (collapse + mobile), header (brand, role, theme toggle). |

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | **React 19**, **React Router 7** |
| Build | **Vite 8**, **@vitejs/plugin-react**, React Compiler (Babel) |
| Charts | **Recharts 3** |
| Icons | **Lucide React** |
| State | **Zustand 5** + `persist` → `localStorage` |
| Styling | **CSS** (feature split: dashboard, insights, transactions, base) |
| Lint | **ESLint 9** (React Hooks + Refresh) |

---

## Getting started

**Prerequisites:** Node.js **20+** (LTS) and npm.

```bash
git clone https://github.com/akash768145s/finance-dashboard-ui.git
cd finance-dashboard-ui
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**).

```bash
npm run build    # output: dist/
npm run preview  # serve dist locally
```

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server + HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

---

## Application map

| Path | View |
|------|------|
| `/` | Dashboard |
| `/transactions` | Transactions |
| `/insights` | Insights |

Layout: header (role, theme), side navigation, main content, footer.

---

## Data model & calculations

- **USD** via `Intl.NumberFormat`.
- **Transactions:** positive amounts; **`type`:** `income` | `expense`; **category** from `src/data/mockData.js`; optional **note**.
- **Available funds:** opening balance + net of all transactions (`useSummary`).
- **Months:** `yyyy-mm` from ISO dates (`src/utils/format.js`).
- **Shared rollups:** `src/utils/financeAggregates.js` (`balanceBeforeMonth`, `balanceAtEndOfMonth`) keeps charts and tooltips aligned.
- **Insights:** centralized in **`useInsights()`** / **`useFinanceMetrics.js`** so Dashboard and Insights use the same definitions for “latest month,” totals, and comparisons.

---

## State & persistence

**Store:** `src/store/useFinanceStore.js` — transactions, opening balance, role, theme, filters, search, sort.

**Persisted** (`localStorage`, key `finance-dashboard`): transactions, opening balance, role, theme.  
**Not persisted:** filters and search (fresh session for the table).

---

## Project structure

```
src/
├── components/
│   ├── Base/          # Header, Footer, ThemeSync, ConfirmDialog
│   ├── Dashboard/     # Summary, charts, recent transactions
│   ├── Insights/      # Insights page, spending breakdown
│   └── Transactions/  # Table, modal, filters, export
├── data/mockData.js
├── hooks/useFinanceMetrics.js
├── store/useFinanceStore.js
├── styles/            # dashboard-*.css
├── utils/format.js, financeAggregates.js
├── App.jsx
└── main.jsx
```

---

## Assumptions & limitations

- **No backend** — demo / evaluation scope per assignment.
- **Roles** are UI-only (not enforceable server-side).
- **Single currency**; no bank linking or imports.
- Reasonable assumptions on copy and layout, as encouraged in the brief.

---

## Quality & accessibility

- Semantic headings and landmarks; **ARIA** on icon-only controls where needed.
- Dialogs and forms usable with keyboard where applicable.
- Run **`npm run lint`** before final checks.

---

## Note for reviewers

This project is submitted as **original work** for **Zorvyn FinTech Pvt. Ltd.** — **Finance Dashboard UI** (Frontend Developer Intern). It is intended to demonstrate **UI structure**, **state handling**, and **clarity of presentation** rather than production infrastructure.

---

*Ledger — one ledger, consistent rollups, from overview → transactions → insights.*
