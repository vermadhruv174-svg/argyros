# Argyros

Flagship jewellery storefront — 925 sterling silver, made personal.

## Monorepo structure

```
argyros/
├── apps/
│   ├── api/          NestJS REST API
│   └── web/          Next.js 15 storefront
├── packages/
│   ├── database/     Prisma schema, migrations, seed
│   └── ui/           Shared UI components (M2+)
├── docker-compose.yml
└── .env.example
```

## Quick start

### Prerequisites
- Node.js >= 22
- Docker Desktop (for PostgreSQL 16 + Redis 7)

### 1. Environment
```bash
cp .env.example .env
```

### 2. Infrastructure
```bash
docker compose up -d
```

### 3. Dependencies
```bash
npm install
```

### 4. Database
```bash
npm run db:migrate    # run migrations
npm run db:seed       # seed catalogue
```

### 5. Development
```bash
npm run dev           # starts api (port 4000) + web (port 3000)
```

## API endpoints (M1)

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List active products |
| GET | `/api/products/:slug` | Product detail |

## Design tokens

Tokens are defined in `D:\AEOS\aeos-brand\packages\argyros-brand`.

| Token | Value | Usage |
|---|---|---|
| ink | `#171717` | Primary text |
| paper | `#F8F6F1` | Background |
| gold | `#A6814C` | Accent |
| silver | `#C5C7C7` | Secondary accent |
| line | `#DEDAD2` | Borders |
| success | `#246A4F` | Positive state |
| wine | `#251C1B` | Dark sections |
