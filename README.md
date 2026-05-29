# Task Manager API

A production-ready REST API built with NestJS, PostgreSQL, and JWT authentication. Supports full task management with user-specific access control.

## Tech Stack

- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL (via Docker)
- **ORM:** TypeORM
- **Auth:** JWT + Passport
- **Validation:** class-validator

## Features

- User registration and login with hashed passwords
- JWT-protected routes
- Full task CRUD (Create, Read, Update, Delete)
- Task status tracking: `TODO` → `IN_PROGRESS` → `DONE`
- Task priority levels: `LOW`, `MEDIUM`, `HIGH`
- Users can only access their own tasks

## Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop

### 1. Clone the repo
```bash
git clone https://github.com/lakshyabharani/task-manager-api.git
cd task-manager-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your values (defaults work if using Docker Compose).

### 4. Start the database
```bash
docker-compose up -d
```

### 5. Start the server
```bash
npm run start:dev
```

Server runs at `http://localhost:3000/api`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Tasks (all require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for logged-in user |
| GET | `/api/tasks/:id` | Get a single task |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Example Requests

### Register
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Create Task
```json
POST /api/tasks
Authorization: Bearer <token>

{
  "title": "Build portfolio",
  "description": "Complete the NestJS API project",
  "priority": "HIGH",
  "dueDate": "2026-06-30"
}
```

### Update Task Status
```json
PATCH /api/tasks/:id
Authorization: Bearer <token>

{
  "status": "IN_PROGRESS"
}
```

## Project Structure

```
src/
├── auth/           # JWT auth, login, register
│   ├── dto/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── jwt.strategy.ts
├── users/          # User entity and service
│   ├── user.entity.ts
│   ├── users.service.ts
│   └── users.module.ts
├── tasks/          # Task CRUD with access control
│   ├── dto/
│   ├── task.entity.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
├── common/         # Global filters
└── main.ts
```