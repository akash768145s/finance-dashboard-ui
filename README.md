# Ledger — Finance dashboard (demo)

A small **React + Vite** dashboard for tracking a personal balance, income/expenses, trends, and transactions. Data is **mock/frontend-only**; roles are **simulated** for the UI.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # serve dist locally
```

## What’s included

### Dashboard overview

- **Summary cards**: total balance (opening balance + net of all transactions), total income, total expenses.
- **Balance trend**: area chart of **end-of-month balance** after each month’s activity.
- **Spending breakdown**: donut chart of **expenses by category**.

### Transactions

- Table: date, amount, category, type (income/expense), optional note.
- **Search** across category, note, and type.
- **Filters**: category, type.
- **Sort**: by date, amount, or category; ascending/descending.
- **Export**: current filtered list as **CSV** or **JSON**.

### Role-based UI (frontend only)

- **Viewer**: read-only; no add/edit/delete.
- **Admin**: add transactions, edit, delete (with confirm).
- Switch role from the header **Role** dropdown.

### Insights

- **Highest spending category** (by total expenses).
- **Month-over-month comparison** using the **latest two months present in the data** (works well with static seed data).
- Short **cash-flow observation** for the latest month in the dataset.

### State management

- **Zustand** store: transactions, role, theme, filters, sort.
- **Persist** (localStorage): transactions, opening balance, role, theme — so refreshes keep your edits. Filters/search are intentionally **not** persisted (fresh session).

### UX extras

- **Dark / light** toggle (persisted).
- **Empty states**: no transactions, or no rows after filters.
- **Reset demo data** (footer, **Admin** only): restores the built-in seed dataset.

## Project layout

- `src/data/mockData.js` — seed transactions and categories.
- `src/store/useFinanceStore.js` — Zustand store + persistence.
- `src/hooks/useFinanceMetrics.js` — filtered list, summaries, chart/insight derivations.
- `src/components/` — layout sections (header, charts, table, modal, etc.).
- `src/dashboard.css` — layout and theming (`data-theme` on `<html>`).

## Assumptions

- Currency is **USD**; amounts are stored as positive numbers with a separate **type** field.
- “Total balance” = **opening balance** + sum(incomes) − sum(expenses) over all stored transactions.

## Tech stack

- React 19, Vite 8, Recharts, Zustand.
