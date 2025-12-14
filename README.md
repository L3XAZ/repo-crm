<h1 style="text-align: center;">Repo CRM</h1>

<p style="text-align: center;">
  Full-stack application for managing public GitHub repositories.
</p>

---

## Overview

Repo CRM allows authenticated users to manage a personal list of public GitHub repositories.  
Users can add repositories using the `owner/name` format, view stored metadata, refresh data from GitHub, and remove entries.

---

## 🧱 Technology Stack

### Backend
- **Node.js**
- **TypeScript**
- **Express**
- **MongoDB (Mongoose)**
- **JWT-based authentication** (httpOnly cookies)
- **GitHub REST API**

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **@tanstack/react-query** (server state management)
- **Material UI**

### Infrastructure & Tooling
- **Docker**
- **Docker Compose**
- **Nginx** (production frontend)
- **Multi-stage Docker builds**
- **ESLint & Prettier**
- **Husky & lint-staged**

The project uses a **monorepo structure** with separate frontend and backend workspaces.

---

## 🚀 Running the Application

### Option 1. Full Application (Docker, recommended)

This is the recommended way to run the project for review.

Build and start all services:

```bash
docker compose up --build
```

After startup:

- **Frontend (served by Nginx):** http://localhost
- **Backend API:** http://localhost:4000
- **MongoDB:** runs inside the Docker network

No additional configuration is required.  
If no environment variables are provided, the application runs using **safe fallback defaults**.

---

### Option 2. Local Development (Frontend locally)

This mode is intended for active development with fast feedback.

Start MongoDB:

```bash
docker run -d --name local-mongo -p 27017:27017 mongo:6
```

Start backend:

```bash
npm --workspace backend run dev
```

Start frontend:

```bash
npm --workspace frontend run dev
```

Services:

- **Frontend (Vite):** http://localhost:5173
- **Backend API:** http://localhost:4000

In this mode:

- **Frontend runs with hot reload**
- **API requests are proxied to the backend**
- **Development workflow is optimized for fast iteration**

## 🌱 Environment Variables

**Environment variables are optional.**

The application is designed to run without any `.env` files, using fallback defaults.

`.env.example` file is provided only as a reference for customization.

If a `.env` file exists, its values override defaults

If it does not exist, the system still works correctly

## 🛠 Scripts

**Lint** and auto-fix code:

```bash
npm run lint
```

Format code with **Prettier**:

```bash
npm run format
```

## 🔐 Authentication

Authentication is cookie-based.

**JWT tokens are stored in httpOnly cookies** and are never accessed directly on the frontend.

When authentication fails or expires, the backend responds with
401 Unauthorized, and the frontend redirects the user to the login page.
