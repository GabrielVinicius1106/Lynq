# Lynq App - Notes, Tasks ans Reminders powered by AI.

An app for notes, tasks and reminders powered by an LLM (Large Language Model) for NLP (Natural Language Processing).

I'm creating this application as a way to learn fundamentals, technologies, and good practices of Software Engineering.

And of course, creating a REAL APPLICATION for REAL USERS (me included). 

## Concepts, Technologies & Good Practices Learned

- Layered Architecture
    Services
    Controllers
    Repositories (Database and InMemory)
    Providers

- SOLID Patterns
    Single Responsibility Principle
    Interface Segregation Principle
    Dependency Inversion Principle  


- Prisma ORM
    Migrations

- Validations with Zod and Typescript

- Authentication and Authorization Flows
    - Access Token and Refresh Tokens

- HTPP Cookies

- Docker
    Creating Conteiners
    Manage Conteiners


- Redis
- Blacklists with Redis
- Rate Limiters with Fastify

- Error Handlers and Global Error Handlers

- Creating Tests for the Application
- Git and Version Control Best Practices

## Tech Stack

- Typescript (main language)
- PostgreSQL (database)

- Fastify (nodejs framework)
- Prisma ORM (database queries)

- Docker (database and redis conteinerization)
- Redis (blacklists and caching)

- Zod (validation)

- Vitest (tests)

## How to run?

Clone the repository

```bash
git clone https://github.com/GabrielVinicius1106/Lynq.git
```

Open the directory

```bash
cd Lynq/
```

Install the dependencies

```bash
npm install
```

Create a *docker-compose.yml* file

```bash
services: # Services
  postgres: # Configure a POSTGRESQL Image
    image: postgres:15-alpine
    container_name: lynq-postgres
    environment:
      - POSTGRES_USER=your_username
      - POSTGRES_PASSWORD=your_password
      - POSTGRES_DB=lynq-db
    ports:
      - "5432:5432"

  redis: # Configure a REDIS Image
    image: redis:7-alpine
    container_name: lynq-redis
    ports:
      - "6379:6379"
```

Create a *.env* file from *.env.example*

```bash
PORT=5000
NODE_ENV="development"

JWT_SECRET="your_secret"

COOKIES_SECRET="your_cookies_secret"

RESEND_API_KEY = "your_email_provider_api_key"

DATABASE_URL="postgres://your_username:your_password@localhost:5432/lynq-db?schema=public"
```

Run the command to start the conteiners

```bash
npm run docker-compose
``` 

Run the server

```bash
npm run server
```

## Good Practices for Branching and Commiting

### Commiting

On commiting, follow the pattern `type: feature description`:

```bash
git commit --message "type: what does this commit do"
```

| Type       | When to Use
|------------|-----------------------------------------------------------------
| `feature`  | New Feature
| `fix`      | Bug Fix
| `refactor` | Refactorings without Changing the Behavior
| `docs`     | Changes or Creations on Documents
| `chore`    | Changes or Creations on Settings, Dependencies, Tools, etc.

**Examples:**
```bash
git commit -m "feat: create createUserService"
git commit -m "fix: fix Redis TTL value"
git commit -m "docs: update README with new instructions"
```

Small and Frequent Commits are a Good Practice. So much more easy to track and restore if necessary.

---

#### 📋 Work Flow


1. Pull Changes from MAIN

```bash
   git switch main
   git pull
```

2. Create Branch

```bash
   git switch --create <branch_name>
```

3. Build, and Create Commits
   
```bash
   git commit --message "feat: ..."
```

4. Push the Branch
   
```bash
   git push origin <branch_name>
```

### 🌿 Branching

**Don't work directly in `main` branch.**

**Always create a NEW BRANCH for feature, fix, docs, etc.**

```bash
git switch --create branch_name
```

### How to Name a Branch

Follow the pattern `type/descriptiom`:

| Type       | When to Use
|------------|-----------------------------------------------------------------
| `feature/` | New Feature
| `fix/`     | Bug Fix
| `refactor/`| Refactorings without Changing the Behavior
| `docs/`    | Changes or Creations on Documents
| `chore/`   | Changes or Creations on Settings, Dependencies, Tools, etc.


**Examples:**
```bash
feature/create-user
feature/user-auth
fix/email-service
``` 

---