# 🤝 Contributor Onboarding Guide — Eco Farm v4.0

Welcome to the Eco Farm v4.0 development community! This guide outlines how to build, test, and contribute to our post-quantum cognitive monorepo.

---

## 🛠️ Local Monorepo Setup

This repository is powered by **Turborepo** and **pnpm** workspaces:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-org/eco-farm.git
   cd eco-farm
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Verify Prisma Schema:**
   Generate the Prisma Client inside `@eco-farm/db`:
   ```bash
   pnpm run build
   ```

4. **Start the Development Stack:**
   Refer to [README.md](../README.md) for database configuration and individual workspace command invocations.

---

## 🖋️ Code Style & Linting Guidelines

### JavaScript / TypeScript (NestJS & Next.js)
- Code is formatted using Prettier and linted via ESLint.
- **Rule of Type Portability (TS2742):** In shared workspaces like `@eco-farm/api`, always annotate controller and service return types explicitly (e.g., `: Promise<any>`) to prevent build-time portability errors.

### Python (SNN Engine & Bioinformatics)
- Follow PEP 8 guidelines.
- Format code using Black or `ruff`.

---

## 🚀 Pull Request Process

1. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/quantum-soil-telemetry
   ```
2. **Commit Messages:**
   Follow conventional commits syntax:
   - `feat: added crystals-dilithium envelope encryption`
   - `fix: resolved timescaledb hypertable index sort`
3. **Verify Builds:**
   Run `pnpm run build` locally before pushing to confirm the monorepo builds flawlessly.
