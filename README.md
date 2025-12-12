Repo CRM — Full-stack Test Project

Simple CRM system for managing public GitHub repositories.
Includes authentication, project list, GitHub API integration, update/remove actions, and Docker-first setup.

Tech Stack
Backend

Node.js, TypeScript

Express

MongoDB (Mongoose)

JWT authentication

Frontend

React + Vite

Nginx (Docker production)

Infrastructure

Docker & Docker Compose

Multi-stage builds

Environment-aware configuration

Project Structure
repo-crm/
backend/
src/
Dockerfile
.env (local dev only)
frontend/
src/
Dockerfile
docker-compose.yml
.env.example

Environment Variables

The project supports two environments:

1) Local development (without Docker)

Backend reads env variables from:

backend/.env


Example:

PORT=4000
MONGO_URI=mongodb://localhost:27017/repo-crm
JWT_SECRET=dev_jwt_secret
JWT_EXPIRES_IN=1d
GITHUB_TOKEN=
NODE_ENV=development


This file is ignored by Git and is intended only for your local workflow.

2) Docker / Review environment

Docker Compose loads variables from a root-level .env file.

Create it:

cp .env.example .env


If .env is missing, the system still works because Docker Compose and backend provide safe fallback defaults:

PORT: 4000

MONGO_URI: mongodb://mongo:27017/repo-crm

JWT_SECRET: default_jwt_secret

JWT_EXPIRES_IN: 1d

GITHUB_TOKEN: empty (GitHub API will work with rate limits)

VITE_API_URL: http://localhost:4000

Running the Project
1) Local Development (fastest workflow)
   Start MongoDB
   docker run -d --name local-mongo -p 27017:27017 mongo:6

Backend
npm --workspace backend run dev

Frontend
npm --workspace frontend run dev


Backend runs on http://localhost:4000.
Frontend runs on http://localhost:5173.

2) Full Application (Docker mode)

Build and start everything with one command:

docker compose up --build


Services:

Frontend → http://localhost

Backend → http://localhost:4000

MongoDB → container-internal (mapped to localhost:27017)

No additional setup required.

Authentication Notes

JWT tokens expire based on:

JWT_EXPIRES_IN


Default: 1d (1 day).
When a token expires, API returns 401 Unauthorized.
Frontend should redirect the user to the login page.

Scripts
Install dependencies:
npm install

Format / Lint:
npm run lint
npm run format

Summary

This project is designed to:

run locally with zero friction,

run in Docker with one command,

be fully reproducible for reviewers,

avoid hard dependencies on environment variables,

follow clean architecture and separation between dev and prod.

If .env is missing — the system still runs.
If .env is present — it overrides defaults.

Everything is deterministic and predictable.