# Cocktail Management REST API

A REST API for managing cocktails and ingredients, built with **NestJS**, **Prisma ORM**, and **PostgreSQL**. Created as a recruitment project for a SOLVRO university research group.

---

## Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (running in Docker)
- **ORM:** Prisma v7 (with `@prisma/adapter-pg`)
- **Authentication:** JWT (JSON Web Tokens) + RBAC (Roles: `USER`, `ADMIN`)
- **Documentation:** Swagger UI (`@nestjs/swagger`)
- **Validation:** `class-validator` + `class-transformer`

---

## Key Features

1. **Auth & Security:**
    - Register (`/api/auth/register`) and Login (`/api/auth/login`).
    - Route protection with JWT guards.
    - Users can only edit or delete their own data (Admins can manage everything).

2. **Ingredients:**
    - Full CRUD operations (Create, Read, Update, Delete).
    - Pagination and search/filter support (`page`, `limit`).

3. **Cocktails:**
    - Full CRUD with **M:N (Many-to-Many)** relationships to ingredients.
    - Pagination and search/filter support (`page`, `limit`).
    - Detailed response output including ingredient amounts and units.

---

## Quick Start Guide

### 1. Requirements
- **Node.js** (v18 or higher)
- **Docker** & **Docker Compose**

### 2. Environment Setup
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

### 3. Start Database
   Run PostgreSQL inside Docker:
   ```bash
   docker compose up -d
   ```

### 4. Install Dependencies & Push Database Schema
   Install packages:
   ```bash
   npm install
   ```

   Push database schema via Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 5. Seed the Database (optional)
   Seed database with initial data:
   ```bash
   npx prisma db seed
   ```

### 6. Run the Server
   Development mode: 
   ```bash
   npm run start:dev
   ```

## API Documentation (Swagger)
Interactive API documentation is available at:

http://localhost:3000/api
