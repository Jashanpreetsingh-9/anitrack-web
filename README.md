# AniTrack Web

Next.js frontend for AniTrack — anime watchlist with OAuth login and LLM recommendations.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

See [../README.md](../README.md) for full-stack local development and OAuth configuration.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test:e2e` | Playwright smoke tests |
