http://localhost:5000/api/docs

npx prisma db push
npx prisma studio

# Backend Project Complete Guide

This document explains the complete backend architecture, how components connect, and how to create new APIs.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Folder Structure](#3-folder-structure)
4. [How Components Connect](#4-how-components-connect)
5. [Prisma (Database)](#5-prisma-database)
6. [Modules Explained](#6-modules-explained)
7. [Middleware](#7-middleware)
8. [Guards & Authentication](#8-guards--authentication)
9. [Decorators](#9-decorators)
10. [DTOs (Data Transfer Objects)](#10-dtos-data-transfer-objects)
11. [Exception Filters](#11-exception-filters)
12. [How to Create a New API](#12-how-to-create-a-new-api)
13. [API Endpoints Reference](#13-api-endpoints-reference)
14. [Useful Commands](#14-useful-commands)
15. [Best Practices](#15-best-practices)

---

## 1. Project Overview

This is a **NestJS** backend application with:

- **PostgreSQL** database via **Prisma ORM**
- **JWT Authentication** (login/register)
- **Role-based access control** (admin/user)
- **API Documentation** via Swagger
- **Soft delete** built into Prisma

---

## 2. Technology Stack

| Technology          | Purpose                                                  |
| ------------------- | -------------------------------------------------------- |
| **NestJS**          | Node.js framework for building scalable server-side apps |
| **Prisma**          | ORM for database interaction (type-safe queries)         |
| **PostgreSQL**      | Relational database                                      |
| **JWT**             | JSON Web Token for authentication                        |
| **Passport.js**     | Authentication middleware                                |
| **class-validator** | Input validation                                         |
| **Swagger/OpenAPI** | API documentation                                        |
| **bcryptjs**        | Password hashing                                         |

---

## 3. Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema definition
│   ├── migrations/       # Database migration files
│   └── seed.ts          # Seed data for database
├── src/
│   ├── main.ts           # App entry point (server starts here)
│   ├── app.module.ts     # Root module - connects all modules
│   ├── app.service.ts    # Basic app service
│   ├── app.controller.ts # Basic app controller
│   │
│   ├── auth/             # Authentication module
│   │   ├── auth.module.ts           # Auth module definition
│   │   ├── auth.service.ts          # Auth business logic (login/register)
│   │   ├── auth.controller.ts       # Auth endpoints (POST /auth/login, /auth/register)
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts      # JWT validation strategy
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts    # Protects routes - needs valid JWT
│   │   │   └── roles.guard.ts       # Protects routes - checks user role
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts   # Runs before controller - extracts user from JWT
│   │   ├── decorators/
│   │   │   ├── public.decorator.ts   # Marks endpoint as public (no auth needed)
│   │   │   ├── roles.decorator.ts    # Specifies required roles (@Roles('admin'))
│   │   │   └── get-user.decorator.ts # Gets current user from request
│   │   ├── dtos/
│   │   │   └── index.ts             # LoginDto, RegisterDto
│   │   ├── interfaces/               # TypeScript interfaces
│   │   └── enums/
│   │       └── role.enum.ts         # Role enum (ADMIN, USER)
│   │
│   ├── modules/           # Feature modules (business logic)
│   │   └── users/        # Users module
│   │       ├── user.module.ts
│   │       ├── user.controller.ts   # User endpoints
│   │       ├── dto/                 # Data Transfer Objects
│   │       │   ├── create-user.dto.ts
│   │       │   ├── update-user.dto.ts
│   │       │   └── get-users.dto.ts
│   │       ├── interfaces/          # TypeScript interfaces
│   │       └── services/
│   │           ├── user.service.ts              # User queries
│   │           └── user-registration.service.ts # User creation
│   │
│   ├── prisma/           # Database connection
│   │   ├── prisma.service.ts    # Database service (extends PrismaClient)
│   │   └── prisma.module.ts     # Global module - available everywhere
│   │
│   ├── config/           # App configuration
│   │   ├── app-config.module.ts
│   │   └── app-config.service.ts
│   │
│   ├── common/           # Shared components
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts  # Global error handler
│   │   └── decorators/
│   │       └── match.decorator.ts         # Custom validation (password match)
│   │
│   └── utils/            # Utility functions
│       ├── utils.module.ts
│       └── string-utils.service.ts       # String manipulation
│
└── .env                  # Environment variables
```

---

## 4. How Components Connect

### 4.1 Request Flow (The Journey of an API Call)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REQUEST FLOW DIAGRAM                                │
└─────────────────────────────────────────────────────────────────────────────┘

  1. Client sends request
           │
           ▼
  2. main.ts (Entry Point)
     - Parses JSON body
     - Enables CORS
     - Applies global pipes (ValidationPipe)
     - Applies global filters (HttpExceptionFilter)
           │
           ▼
  3. AppModule
     - Applies global middleware (AuthMiddleware)
     - Routes to correct module
           │
           ▼
  4. AuthMiddleware (auth.middleware.ts)
     - Extracts JWT from header
     - Verifies token
     - Attaches user to request
           │
           ▼
  5. Controller (e.g., UserController)
     - Receives HTTP request
     - Applies Guards (JwtAuthGuard, RolesGuard)
     - Calls Service methods
           │
           ▼
  6. Service (e.g., UserService)
     - Contains business logic
     - Calls PrismaService for database
           │
           ▼
  7. PrismaService (prisma.service.ts)
     - Executes database queries
     - Returns data to Service
           │
           ▼
  8. Response goes back through layers
           │
           ▼
  9. Client receives response
```

### 4.2 Module Connection Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MODULE HIERARCHY                                  │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │   AppModule     │  ← Root module (connects everything)
                        │  (app.module.ts)│
                        └────────┬────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
           ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    PrismaModule  │  │     AuthModule   │  │     UserModule   │
│  (GLOBAL - everywhere)│ │                  │  │                  │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                      │                      │
         │              ┌───────┴───────┐              │
         │              │               │              │
         │              ▼               ▼              │
         │    ┌────────────────┐ ┌────────────────┐   │
         │    │ AuthService    │ │ JwtStrategy    │   │
         │    │ (login/reg)    │ │ (validate JWT)│   │
         │    └────────────────┘ └────────────────┘   │
         │                      │                      │
         │                      ▼                      ▼
         │            ┌──────────────────┐  ┌──────────────────┐
         │            │ AuthController    │  │ UserController  │
         │            │ /auth/login       │  │ /users          │
         │            │ /auth/register   │  │                 │
         │            └──────────────────┘  └──────────────────┘
         │                                    │
         └────────────┬───────────────────────┘
                      │
                      ▼
            ┌──────────────────┐
            │  PrismaService   │
            │  (database)      │
            └──────────────────┘
```

---

## 5. Prisma (Database)

### 5.1 What is Prisma?

Prisma is an **ORM (Object-Relational Mapper)** that lets you:

- Define database schema in `schema.prisma`
- Generate type-safe TypeScript code
- Query database without writing raw SQL

### 5.2 Schema Example (schema.prisma)

```prisma
// backend/prisma/schema.prisma

model User {
  id        String   @id @default(uuid())    // Primary key, auto-generated UUID
  name      String                           // Required String
  email     String   @unique                  // Unique constraint
  password  String?                          // Optional String
  role      String   @default("user")         // Default value
  createdAt DateTime @default(now())          // Auto timestamp

  @@map("users")    // Maps to "users" table in database
}
```

### 5.3 How PrismaService Works

```typescript
// src/prisma/prisma.service.ts

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Soft delete extension - automatically filters deleted records
  constructor() {
    super({
      log: ["error"],
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
    });

    // Add soft delete to ALL models automatically
    const softDeleteExtension = Prisma.defineExtension((client) => {
      return client.$extends({
        query: {
          $allModels: {
            async findMany({ args, query }) {
              // Add deletedAt: null to every query automatically
              if (!args.where || !args.where.deletedAt) {
                args.where = { ...args.where, deletedAt: null };
              }
              return query(args);
            },
          },
        },
      });
    });
    this.$extends(softDeleteExtension);
  }

  async onModuleInit() {
    await this.$connect(); // Connect to database when app starts
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Disconnect when app stops
  }
}
```

### 5.4 Using Prisma in Services

```typescript
// Inside any service
constructor(private prisma: PrismaService) {}

// Query examples:
await this.prisma.user.findMany()           // Get all users
await this.prisma.user.findUnique({ where: { id: 'uuid' } })
await this.prisma.user.create({ data: { name: 'John', email: 'john@test.com' } })
await this.prisma.user.update({ where: { id: 'uuid' }, data: { name: 'Jane' } })
await this.prisma.user.delete({ where: { id: 'uuid' } })  // Soft delete (sets deletedAt)
```

---

## 6. Modules Explained

### 6.1 What is a Module?

A module is a **logical grouping** of related code. It organizes:

- Controllers (routes)
- Services (business logic)
- Other modules it depends on

### 6.2 Module Structure

```typescript
// src/modules/users/user.module.ts

@Module({
  imports: [PrismaModule, UtilsModule], // What this module needs
  controllers: [UserController], // Route handlers
  providers: [UserService, UserRegistrationService, StringUtilsService], // Business logic
  exports: [UserService, UserRegistrationService], // Available to other modules
})
export class UserModule {}
```

### 6.3 AppModule (Root Module)

```typescript
// src/app.module.ts

@Module({
  imports: [
    AppConfigModule, // Configuration
    PrismaModule, // Database (GLOBAL - available everywhere)
    AuthModule, // Authentication
    UserModule, // User management
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Global guard - all routes protected by default
    },
    AppConfigService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*"); // Apply middleware to all routes
  }
}
```

---

## 7. Middleware

### 7.1 What is Middleware?

Middleware runs **BEFORE** the controller. It's like a checkpoint that:

- Can read/modify request
- Can decide to stop the request
- Must call `next()` to continue

### 7.2 AuthMiddleware Example

```typescript
// src/auth/middleware/auth.middleware.ts

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next(); // No token, continue anyway
      return;
    }

    try {
      const token = authHeader.split(" ")[1]; // Extract "Bearer TOKEN"
      const payload = this.jwtService.verify(token); // Verify JWT

      const user = await this.userService.findById(payload.sub);
      req["user"] = user; // Attach user to request

      next();
    } catch (error) {
      next(); // Invalid token, continue anyway (guards will handle it)
    }
  }
}
```

### 7.3 Applying Middleware

```typescript
// In app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply to ALL routes
    consumer.apply(AuthMiddleware).forRoutes("*");

    // Or apply to specific routes
    // consumer.apply(AuthMiddleware).forRoutes('users/*');
  }
}
```

---

## 8. Guards & Authentication

### 8.1 What are Guards?

Guards determine **whether a route can be accessed**. They run after middleware.

### 8.2 JwtAuthGuard (Authentication)

```typescript
// src/auth/guards/jwt-auth.guard.ts

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if endpoint is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true; // Skip authentication for public routes

    return super.canActivate(context); // Validate JWT
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException("Authentication required");
    }
    return user;
  }
}
```

### 8.3 RolesGuard (Authorization)

```typescript
// src/auth/guards/roles.guard.ts

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // No roles required

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role); // Check if user has required role
  }
}
```

### 8.4 How They Connect

```
Request → Middleware → Guard → Controller

Middleware: Extracts user from JWT, attaches to request
JwtAuthGuard: Checks if JWT is valid (authentication)
RolesGuard: Checks if user has correct role (authorization)
Controller: Handles the request
```

---

## 9. Decorators

### 9.1 What are Decorators?

Decorators are ** TypeScript annotations** that add metadata to classes/methods/properties.

### 9.2 Common Decorators

| Decorator                 | Purpose                    | Example                      |
| ------------------------- | -------------------------- | ---------------------------- |
| `@Controller()`           | Defines a route controller | `@Controller('users')`       |
| `@Get()`, `@Post()`, etc. | HTTP method                | `@Get()`, `@Post()`          |
| `@UseGuards()`            | Apply guards               | `@UseGuards(JwtAuthGuard)`   |
| `@UsePipes()`             | Apply pipes                | `@UsePipes(ValidationPipe)`  |
| `@Body()`                 | Get request body           | `@Body() dto: CreateUserDto` |
| `@Query()`                | Get query params           | `@Query() query: SearchDto`  |
| `@Param()`                | Get URL params             | `@Param('id') id: string`    |
| `@Req()`                  | Get full request           | `@Req() req: Request`        |

### 9.3 Custom Decorators in This Project

#### Public Decorator (skip authentication)

```typescript
// src/auth/decorators/public.decorator.ts
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Usage in controller:
@Public()
@Post('login')
async login() { }
```

#### Roles Decorator (require specific roles)

```typescript
// src/auth/decorators/roles.decorator.ts
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Usage in controller:
@Roles(Role.ADMIN)
@Get('admin-only')
async adminEndpoint() { }
```

#### GetUser Decorator (get current user)

```typescript
// src/auth/decorators/get-user.decorator.ts
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);

// Usage in controller:
@Get('profile')
async getProfile(@GetUser() user: any) {
  // Returns full user object
}

@Get('profile')
async getProfile(@GetUser('email') email: string) {
  // Returns just the email
}
```

---

## 10. DTOs (Data Transfer Objects)

### 10.1 What are DTOs?

DTOs define the **shape of data** expected in requests and apply **validation**.

### 10.2 Example DTOs

```typescript
// src/auth/dtos/index.ts

export class LoginDto {
  @ApiProperty({ example: "user@example.com" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Please provide a valid email address." })
  email: string;

  @ApiProperty({ example: "password123" })
  @IsNotEmpty({ message: "Password is required." })
  @IsString()
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: "John Doe" })
  @IsNotEmpty({ message: "Name is required." })
  @IsString()
  name: string;

  @ApiProperty({ example: "password123" })
  @MinLength(6, { message: "Password must be at least 6 characters long." })
  password: string;

  @Match("password", { message: "Passwords do not match." })
  passwordConfirmation: string;
}
```

### 10.3 Validation Decorators

| Decorator         | Purpose                  |
| ----------------- | ------------------------ |
| `@IsNotEmpty()`   | Field is required        |
| `@IsString()`     | Field is a string        |
| `@IsEmail()`      | Field is valid email     |
| `@MinLength(n)`   | Minimum length           |
| `@MaxLength(n)`   | Maximum length           |
| `@IsOptional()`   | Field is optional        |
| `@IsEnum()`       | Field must be enum value |
| `@IsNumber()`     | Field is a number        |
| `@IsBoolean()`    | Field is boolean         |
| `@IsDate()`       | Field is a date          |
| `@Match('field')` | Must match another field |

---

## 11. Exception Filters

### 11.1 What is an Exception Filter?

Catches exceptions and returns a **consistent error response** to the client.

### 11.2 HttpExceptionFilter

```typescript
// src/common/filters/http-exception.filter.ts

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.getResponse(),
    });
  }
}
```

### 11.3 Global Error Format

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/users",
  "message": "Email is required."
}
```

---

## 12. How to Create a New API

Let's create a complete **Products API** as an example.

### Step 1: Create Module Folder Structure

```
src/modules/products/
├── products.module.ts
├── products.controller.ts
├── products.service.ts
├── dto/
│   ├── create-product.dto.ts
│   ├── update-product.dto.ts
│   └── get-products.dto.ts
└── interfaces/
    └── product.interface.ts
```

### Step 2: Add Model to Prisma Schema

```prisma
// prisma/schema.prisma

model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  category    String?
  imageUrl    String?  @map("image_url")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  @@map("products")
}
```

### Step 3: Run Migration

```bash
npm run prisma:migrate:dev -- --name add_products_table
```

### Step 4: Create DTOs

```typescript
// src/modules/products/dto/create-product.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty({ example: "iPhone 15" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: "Latest iPhone model" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiProperty({ example: "electronics" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: "https://example.com/image.jpg" })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
```

### Step 5: Create Service

```typescript
// src/modules/products/products.service.ts

import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateProductDto, UpdateProductDto, GetProductsDto } from "./dto";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    this.logger.log("Creating new product");
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(query: GetProductsDto) {
    const { page = 1, limit = 10, search, category } = query;
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.product.count({ where: whereClause }),
    ]);

    return {
      products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    // Soft delete - sets deletedAt timestamp
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
```

### Step 6: Create Controller

```typescript
// src/modules/products/products.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto, GetProductsDto } from "./dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/auth/enums/role.enum";

@ApiTags("Products")
@ApiBearerAuth()
@Controller("products")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new product (Admin only)" })
  @ApiResponse({ status: 201, description: "Product created" })
  create(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all products with pagination" })
  findAll(@Query(ValidationPipe) query: GetProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single product by ID" })
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a product (Admin only)" })
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a product (Admin only)" })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
```

### Step 7: Create Module

```typescript
// src/modules/products/products.module.ts

import { Module } from "@nestjs/common";
import { PrismaModule } from "@/prisma/prisma.module";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### Step 8: Register Module in AppModule

```typescript
// src/app.module.ts

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ProductsModule, // ← Add your new module here
  ],
  // ...
})
export class AppModule {}
```

---

## 13. API Endpoints Reference

### 13.1 Authentication

| Method | Endpoint             | Auth   | Description               |
| ------ | -------------------- | ------ | ------------------------- |
| POST   | `/api/auth/login`    | Public | Login with email/password |
| POST   | `/api/auth/register` | Public | Register new user         |

### 13.2 Users

| Method | Endpoint     | Auth     | Roles       | Description                   |
| ------ | ------------ | -------- | ----------- | ----------------------------- |
| GET    | `/api/users` | Required | ADMIN, USER | Get all users with pagination |

---

## 14. Useful Commands

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build for production

# Database
npm run prisma:generate       # Generate Prisma client
npm run prisma:migrate:dev     # Create and apply migration (dev)
npm run prisma:migrate:deploy  # Apply migrations (production)
npx prisma studio              # Open Prisma database GUI

# Testing & Linting
npm run lint          # Lint code
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:cov      # Run tests with coverage
```

---

## 15. Best Practices

### 15.1 Security

- **All endpoints protected by default** - use `@Public()` to make public
- **Passwords hashed** with bcrypt before storage
- **JWT tokens** with expiration
- **Role-based access** with `@Roles()` decorator

### 15.2 Validation

- Use **ValidationPipe** globally in main.ts
- All inputs should use **DTOs** with class-validator
- Use `@Transform()` to sanitize inputs

### 15.3 Architecture

- **Controllers** - Handle HTTP requests/responses
- **Services** - Business logic, database operations
- **DTOs** - Input validation, API contracts
- **Guards** - Authentication, authorization
- **Middleware** - Pre-processing, logging

### 15.4 Error Handling

- Use **HttpExceptionFilter** globally
- Throw appropriate HTTP exceptions (400, 401, 403, 404, 500)
- Include meaningful error messages

### 15.5 Database

- **Soft delete** - Records not actually deleted, just marked with `deletedAt`
- Use **Prisma transactions** for multiple operations
- Always use **type-safe queries** via Prisma client

---

## Quick Reference: Creating Any New Feature

```
1. Add model to prisma/schema.prisma
2. Run: npm run prisma:migrate:dev -- --name description
3. Run: npm run prisma:generate
4. Create DTOs in src/modules/[feature]/dto/
5. Create Service in src/modules/[feature]/services/
6. Create Controller in src/modules/[feature]/
7. Create Module in src/modules/[feature]/
8. Import module in app.module.ts
9. Done! Test your API
```

---

This guide covers everything you need to understand and extend this backend project.
