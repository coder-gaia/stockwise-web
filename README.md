# Stockwise Web

Frontend application for the Stockwise inventory management system.

Built with React, Vite, TypeScript, TanStack Query, and shadcn/ui.

---

## Related repositories

- Frontend: https://github.com/seu-user/stockwise-web
- API: https://github.com/seu-user/stockwise-api

---

## Features

- JWT authentication
- Automatic token refresh
- Offline inventory operations
- Optimistic UI updates
- Background synchronization
- PWA support
- Responsive interface

---

## Offline-first strategy

Designed for environments with unstable connectivity.

### Offline movement flow

```txt
User submits movement
↓
navigator.onLine?
├── YES → send immediately
└── NO  → save locally in IndexedDB
↓
optimistic UI updates stock instantly
↓
connection restored
↓
pending queue replayed automatically
```

---

## IndexedDB queue

Pending operations are persisted using IndexedDB via `idb`.

Each queued operation contains:

- product id
- movement type
- quantity
- timestamp
- idempotency key

This ensures operations survive:

- page refreshes
- browser restarts
- temporary disconnections

---

## Optimistic updates

Stock changes appear instantly in the UI before server confirmation.

If synchronization fails:

- the cache rolls back safely
- the user receives feedback
- queued operations remain persisted

---

## Authentication flow

### Access token

Stored only in memory.

Never persisted in:

- localStorage
- sessionStorage

### Refresh token

Stored in:

```txt
httpOnly cookie
```

### Automatic refresh

```txt
401 response
↓
Axios interceptor
↓
POST /auth/refresh
↓
retry original request
```

Transparent to the user.

---

## Tech stack

| Layer           | Technology     |
| --------------- | -------------- |
| Framework       | React          |
| Build tool      | Vite           |
| Language        | TypeScript     |
| Styling         | Tailwind CSS   |
| UI library      | shadcn/ui      |
| Server state    | TanStack Query |
| Validation      | Zod            |
| HTTP client     | Axios          |
| Offline storage | idb            |
| Routing         | React Router   |

---

## Running locally

### Requirements

- Node.js 18+
- Stockwise API running locally

---

### Installation

```bash
git clone https://github.com/seu-user/stockwise-web
cd stockwise-web

npm install
```

---

### Environment variables

Create a `.env` file.

```env
VITE_API_URL=http://localhost:3333
```

---

### Start development server

```bash
npm run dev
```

Application:

```txt
http://localhost:5173
```

---

## Demo credentials

```txt
demo@stockwise.app
demo123
```
