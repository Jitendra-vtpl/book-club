# Book Club App

A book club app where users can discover books, build reading lists, write reviews, and see real-time activity feeds. Built with Node.js/Express backend and React frontend.

## What it does

- Browse and search through books
- Create and manage reading lists
- Write and read book reviews
- Real-time updates
- User login and registration

## Tech stuff

- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Frontend**: React, TypeScript, Redux
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Auth**: JWT tokens
- **Docker**: For easy deployment

## Getting started

### What you need
- Docker & Docker Compose
- Node.js 22.10.0 (to run local without Docker)

## Quick start

### Run with Docker Compose

1. **Clone and go to the project**
```bash
git clone <your-repo-url>
cd book-club
```

2. **Start app**
```bash
docker-compose up -d
```

3. **Seed database with sample data**
```bash
docker compose run --rm backend yarn seed
```

4. **Open in browser**
- **Frontend**: http://localhost:8001
    ```bash
    # Login default User
    Email: gravity@bookclub.com
    Password: gravity@123
    ```
- **Backend API**: http://localhost:8000
- **Backend Health check API**: http://localhost:8000/health

5. **Check logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

6. **Stop app**
```bash
docker-compose down
```

7. **Set env for custom port (optional)**
```bash
BACKEND_PORT=8000
WEB_PORT=8001
```

## Development

### Backend
```bash
cd packages/backend
yarn install
yarn dev          # dev server
yarn seed         # populate database with sample data
```

### Frontend
```bash
cd packages/web
yarn install
yarn dev        # dev server
```

## Docker commands

#### Go to the app directory
```bash
cd book-club
```

### Build images
```bash
# Backend
docker build -f docker/Dockerfile -t book-club-backend .

# Frontend (pass API_URL as arg)
docker build -f docker/Dockerfile.web -t book-club-frontend \
  --build-arg REACT_APP_API_URL=http://localhost:8000 .
```

### Run containers
```bash
# Backend
docker run -d -p 8000:8000 --name book-club-backend book-club-backend

# Frontend
docker run -d -p 8001:80 --name book-club-frontend book-club-frontend

# Check logs
docker logs book-club-backend
docker logs book-club-frontend
```

## Project structure

```
book-club/
├── docker/                 # Docker stuff
│   ├── Dockerfile          # Backend container
│   └── Dockerfile.web      # Frontend container
├── packages/
│   ├── backend/            # Backend server
│   └── web/                # React app
├── .env               # environment
└── docker-compose.yml # Local dev
└── README.md
```

## To know more about Backend and Frontend

- **Backend**: `packages/backend/README.md`
- **Frontend**: `packages/web/README.md`


---
