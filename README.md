# Transactions Dashboard

A high-performance, production-ready transaction management dashboard built with **Next.js 14**, **React 18**, and **TypeScript**. Features real-time data management, batch operations, and optimized rendering for large datasets.

## Features

- 📊 **Interactive Dashboard** – View and manage transactions with real-time updates
- ⚡ **Optimized Performance** – Virtual scrolling for large lists via `@tanstack/react-virtual`
- 🔄 **Batch Operations** – Retry failed transactions with request-version guards for out-of-order safety
- 🛡️ **Type Safety** – Full TypeScript support with Zod validation at service boundaries
- 🎯 **Optimistic UI** – Immediate feedback on user actions with `useOptimistic`
- ⚙️ **Server/Client Architecture** – Clean separation of concerns with server-side data fetching and client-side interactivity

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14.2.5 with App Router |
| **UI Library** | React 18.3.1 |
| **Language** | TypeScript 5.5.3 |
| **State Management** | TanStack React Query 5.51.1 (server state) + Local Hooks (UI state) |
| **Data Validation** | Zod 3.23.8 |
| **Virtual Scrolling** | TanStack React Virtual 3.10.8 |
| **Testing** | Vitest 2.0.5 + React Testing Library |
| **Styling** | CSS |
| **Deployment** | GitHub Pages (via Next.js static export) |

## Architecture

### Directory Structure

```
src/features/transactions/
├── api/
│   └── transaction.service.ts    # Data fetching & validation
├── hooks/
│   ├── useTransactions.ts        # Server state + optimistic updates
│   └── useBatchRetry.ts          # Batch retry logic with request versioning
├── components/
│   └── TransactionTable/          # Presentation layer (virtualized)
└── types/
    └── transaction.ts             # TypeScript definitions
```

### Key Design Decisions

1. **Server/Client Boundary**
   - Server Component (`app/page.tsx`) performs initial data fetch
   - Client Feature Module (`TransactionTable`) handles interactive dashboard behavior
   
2. **Service-Component Split**
   - **Infrastructure**: API calls with Zod validation (`transaction.service.ts`)
   - **Application**: Business logic hooks (`useTransactions`, `useBatchRetry`)
   - **Presentation**: UI components with virtual scrolling

3. **State Management**
   - TanStack Query bootstraps server state on initial load
   - Local hooks manage UI orchestration (selection, row states, batch commands) for clarity and simplicity
   - Normalized transaction state (`Record<string, Transaction>`) enables O(1) updates

4. **Safety & Performance**
   - Abort-safe async flows via `AbortController`
   - Request-version guards prevent out-of-order retry resolution
   - Virtual scrolling handles large datasets efficiently
   - Discriminated unions for type-safe row state transitions

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/DeepaliMoraskar/transaction-app.git
cd transaction-app

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app auto-reloads on code changes.

### Production Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

Runs all tests with Vitest. Tests include concurrency utility validation and component behavior.

### Linting

```bash
npm run lint
```

## Project Structure

```
transaction-app/
├── .github/workflows/
│   └── deploy.yml               # GitHub Pages deployment workflow
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Server component (initial fetch)
│   │   └── globals.css
│   ├── features/
│   │   └── transactions/
│   │       ├── api/
│   │       ├── hooks/
│   │       ├── components/
│   │       └── types/
│   └── middleware/
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Development Workflow

### Adding a New Feature

1. Create a new feature directory under `src/features/`
2. Organize into: `api/`, `hooks/`, `components/`, `types/`
3. Implement service layer with Zod validation
4. Build custom hooks for business logic
5. Create presentation components
6. Add tests alongside features

### Data Flow

```
Page (Server) 
  → fetch initial data 
  → passes to <TransactionTable /> (Client)
    → useTransactions (hook)
      → useBatchRetry (hook)
      → local state management
    → TransactionTable Component
      → virtual scrolling rendering
```

## Testing Strategy

- **Unit Tests**: Hooks and utilities (Vitest)
- **Component Tests**: React Testing Library for interaction testing
- **Integration**: Server-side data fetching validated with Zod

Run tests with: `npm test`

## Deployment

The project is configured for automatic deployment to **GitHub Pages** via GitHub Actions:

- **Trigger**: Push to `main` branch
- **Build**: Next.js static export
- **Artifact**: Uploaded to GitHub Pages
- **Action Workflow**: `.github/workflows/deploy.yml`

### Manual Deployment

```bash
npm run build
npm start
```

## Performance Optimizations

- 🚀 **Virtual Scrolling** – Renders only visible rows via `@tanstack/react-virtual`
- 🎯 **Optimistic Updates** – Immediate UI feedback while requests resolve
- 💾 **Normalized State** – O(1) transaction lookups and updates
- 🔗 **Abort-Safe Flows** – Prevents race conditions in async operations
- 📦 **Tree-Shaking** – Unused code eliminated during build

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge) supporting ES2020+.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is private. All rights reserved.

## Author

[DeepaliMoraskar](https://github.com/DeepaliMoraskar)

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev)
