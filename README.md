# Simple Task Manager 2

Simple Task Manager 2 is a minimal local/demo task manager built with a
React frontend, a Node.js + Express backend, and PostgreSQL for local data
storage.

This first release is local/demo-only. It does not include login, user
accounts, roles, sharing, reminders, notifications, subtasks, comments, file
attachments, or production hosting configuration.

## Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL running locally

## Backend Setup

1. Install backend dependencies:

   ```sh
   cd backend
   npm install
   ```

2. Create a local environment file from the example:

   ```sh
   cp .env.example .env
   ```

3. Update `backend/.env` for your local PostgreSQL database. The expected
   database configuration variables are:

   - `DATABASE_URL`
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`
   - `PORT`

4. Start the backend API:

   ```sh
   npm run dev
   ```

   The API listens on `http://localhost:3001` by default. A health check is
   available at `http://localhost:3001/health`.

## Frontend Setup

1. Install frontend dependencies:

   ```sh
   cd frontend
   npm install
   ```

2. Start the Vite development server:

   ```sh
   npm run dev
   ```

   Vite prints the local browser URL when it starts.

## Local Development Workflow

Run PostgreSQL, the backend, and the frontend at the same time in separate
terminal sessions:

```sh
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

For a local production-style frontend build:

```sh
cd frontend
npm run build
npm run preview
```

## Configuration Notes

`backend/.env.example` contains placeholder values only. Do not commit real
passwords, tokens, production connection strings, or other secrets.
