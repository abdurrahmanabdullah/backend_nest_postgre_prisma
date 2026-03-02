# Backend Development Guide & Best Practices

This document serves as a guide for understanding the simplified backend, performing database migrations, and adding new features following industry-standard best practices.

---

## 0. Backend Architecture & File Structure

The project follows a **Modular Architecture**, making it easy to scale and maintain.

- **`prisma/`**: Contains the database schema (`schema.prisma`) and all migration files that keep the database updated.
- **`src/`**: The main directory for source code.
    - **`auth/`**: Handles everything related to security: Login, Registration, JWT generation, and Guards (to protect routes).
    - **`modules/`**: Contains business-specific modules. For example, `users/` handles user profiles and registration logic.
    - **`common/`**: Shared components used throughout the app, such as global error filters and custom validation decorators.
    - **`config/`**: Manages environment variables and application-wide configurations in a centralized way.
    - **`prisma/`**: A wrapper service that allows NestJS to interact with the database using Prisma.
    - **`utils/`**: Generic helper functions (e.g., string conversion) that don't belong to a specific module.
    - **`main.ts`**: The entry point where the application starts and basic configurations (like CORS and Swagger) are set.
    - **`app.module.ts`**: The root module that ties all other modules together into one cohesive application.

---

## 1. Database Connection & Setup

The backend uses **Prisma** as an ORM to interact with the **PostgreSQL** database.

### Initial Setup:
1.  **Configure Environment**: Ensure your `.env` file has the correct `DATABASE_URL`.
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
    ```
2.  **Synchronize Schema**: If you have an existing database, run:
    ```bash
    npx prisma db pull
    ```
3.  **Generate Client**: Always run this after schema changes to update TypeScript types.
    ```bash
    npm run prisma:generate
    ```

### Database Migrations:
- **Create and Apply a Migration**: Run this after changing `schema.prisma`.
  ```bash
  npm run prisma:migrate:dev --name describe_your_change
  ```
- **Apply Migrations (Production)**:
  ```bash
  npm run prisma:migrate:deploy
  ```
- **View Database UI (Prisma Studio)**:
  ```bash
  npx prisma studio
  ```

---

## 2. How to Add a New API (Example: Tasks)

Follow these steps to add a new module/resource in a clean, reusable way.

### Step 1: Create the Module Folder
Create a new folder in `src/modules/` (e.g., `src/modules/tasks`).

### Step 2: Define the DTO (Data Transfer Object)
Create `src/modules/tasks/dto/create-task.dto.ts`. Use `class-validator` for validation to ensure data integrity.
```typescript
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;
}
```

### Step 3: Create the Service
Implement business logic in `src/modules/tasks/tasks.service.ts`. Inject `PrismaService` for database access.
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    this.logger.log('Creating a new task');
    return this.prisma.task.create({ data: dto });
  }

  async findAll() {
    return this.prisma.task.findMany();
  }
}
```

### Step 4: Create the Controller
Define routes in `src/modules/tasks/tasks.controller.ts`. Use decorators like `@Post`, `@Get`, and `@UseGuards`.
```typescript
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // Protect routes
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }
}
```

### Step 5: Register in Module and AppModule
1. Create `src/modules/tasks/tasks.module.ts` and export the service.
2. Import `TasksModule` into `src/app.module.ts`.

---

## 3. Best Practices Applied

- **Security**:
  - All endpoints (except login/register) are protected by `JwtAuthGuard`.
  - Roles are enforced via `RolesGuard` and `@Roles()` decorator.
  - Passwords are encrypted using `bcryptjs`.
- **Validation**:
  - Strict input validation using `ValidationPipe` with `class-validator`.
  - Automatic transformation of payloads to DTO classes.
- **Architecture**:
  - **Controllers**: Handle HTTP requests and responses.
  - **Services**: Contain business logic and database interactions.
  - **DTOs**: Define the shape and validation rules for incoming data.
  - **Prisma**: Provides type-safe database queries.
- **Logging**:
  - Use `Logger` from `@nestjs/common` for tracking application flow and debugging.
- **Error Handling**:
  - Global `HttpExceptionFilter` ensures consistent error response formats.

---

## 4. Useful Commands

- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Lint Code**: `npm run lint`
- **Run Tests**: `npm run test`
