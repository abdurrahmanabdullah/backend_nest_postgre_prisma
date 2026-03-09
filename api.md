# How to Create New CRUD Operation in NestJS

This guide explains step-by-step how to add a new feature with full CRUD (Create, Read, Update, Delete) operations to this backend.

---

## Table of Contents

1. [What is CRUD?](#1-what-is-crud)
2. [Why Do We Need Each File?](#2-why-do-we-need-each-file)
3. [Step-by-Step Guide](#3-step-by-step-guide)
4. [Complete Example: Categories Feature](#4-complete-example-categories-feature)
5. [Testing Your New API](#5-testing-your-new-api)

---

## 1. What is CRUD?

CRUD means **Create, Read, Update, Delete** - the 4 basic operations for any data:

| Operation | HTTP Method | Description |
|-----------|-------------|-------------|
| **C**reate | POST | Add new data |
| **R**ead | GET | Get data |
| **U**pdate | PATCH | Modify existing data |
| **D**elete | DELETE | Remove data |

---

## 2. Why Do We Need Each File?

When you create a new feature in NestJS, you need these 5 types of files:

### 2.1 Why Do We Need a DTO?

**DTO = Data Transfer Object**

```typescript
// src/modules/categories/dto/create-category.dto.ts
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

**Why needed:**
- Defines what data client MUST send
- Validates input automatically (is name a string? is it empty?)
- Prevents hackers from sending extra data
- Documents what the API expects

**Without DTO:** Client could send anything, app might crash
**With DTO:** Invalid data rejected automatically

---

### 2.2 Why Do We Need a Service?

```typescript
// src/modules/categories/categories.service.ts
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.category.findMany();
  }
}
```

**Why needed:**
- Contains **business logic** (the real work)
- Talks to database through Prisma
- Controller should ONLY receive requests and call service
- Service is reusable - can be called from anywhere

---

### 2.3 Why Do We Need a Controller?

```typescript
// src/modules/categories/categories.controller.ts
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
```

**Why needed:**
- Handles **HTTP requests** (GET, POST, etc.)
- Defines API endpoints (URLs)
- Validates input using DTOs
- Returns responses to client

---

### 2.4 Why Do We Need a Module?

```typescript
// src/modules/categories/categories.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
```

**Why needed:**
- **Groups related files** together
- Tells NestJS what belongs to this feature
- Makes code organized and modular
- Enables lazy loading (load module only when needed)

---

### 2.5 Why Do We Need Prisma Schema?

```prisma
// prisma/schema.prisma
model Category {
  id   String @id @default(uuid())
  name String
}
```

**Why needed:**
- Defines **database table structure**
- Creates TypeScript types automatically
- Generates database queries
- Without it, no database table exists!

---

## 3. Step-by-Step Guide

Let's say you want to add **Categories** feature.

### Step 1: Add Model to Prisma Schema

**File:** `prisma/schema.prisma`

Add at the end:

```prisma
model Category {
  id        String   @id @default(uuid())
  name      String
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@map("categories")
}
```

**Why:**
- Creates the database table
- `id @default(uuid())` - auto-generates unique ID
- `createdAt @default(now())` - auto-timestamp
- `deletedAt` - for soft delete

**Run this command:**
```bash
npx prisma db push
```

This updates your database to match the schema.

---

### Step 2: Create DTOs

Create folder: `src/modules/categories/dto/`

**File:** `src/modules/categories/dto/create-category.dto.ts`

```typescript
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

**File:** `src/modules/categories/dto/update-category.dto.ts`

```typescript
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Electronics', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

**File:** `src/modules/categories/dto/get-categories.dto.ts`

```typescript
import { IsOptional, IsInt, Min, IsString, Type } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type as TransformType } from 'class-transformer';

export class GetCategoriesDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @TransformType(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @TransformType(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
```

**File:** `src/modules/categories/dto/index.ts`

```typescript
export * from './create-category.dto';
export * from './update-category.dto';
export * from './get-categories.dto';
```

**Why:**
- `CreateCategoryDto` - rules for creating (name required)
- `UpdateCategoryDto` - all fields optional (you might only update name)
- `GetCategoriesDto` - pagination and search parameters

---

### Step 3: Create Service

**File:** `src/modules/categories/categories.service.ts`

```typescript
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, GetCategoriesDto } from './dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  // CREATE - Add new category
  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.log(`Creating category: ${createCategoryDto.name}`);
    
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  // READ ALL - Get all categories with pagination
  async findAll(query: GetCategoriesDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count({ where: whereClause }),
    ]);

    return {
      categories,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // READ ONE - Get single category by ID
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  // UPDATE - Modify existing category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // First check if exists
    await this.findOne(id);

    this.logger.log(`Updating category: ${id}`);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  // DELETE - Remove category
  async remove(id: string) {
    // First check if exists
    await this.findOne(id);

    this.logger.log(`Deleting category: ${id}`);

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
```

**Why each method:**
- `create()` - inserts new row in database
- `findAll()` - returns list with pagination (for long lists)
- `findOne()` - returns single item, throws error if not found
- `update()` - modifies existing data
- `delete()` - removes data

---

### Step 4: Create Controller

**File:** `src/modules/categories/categories.controller.ts`

```typescript
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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, GetCategoriesDto } from './dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // POST /api/categories - Create new category
  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // GET /api/categories - Get all categories
  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination' })
  findAll(@Query(ValidationPipe) query: GetCategoriesDto) {
    return this.categoriesService.findAll(query);
  }

  // GET /api/categories/:id - Get single category
  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // PATCH /api/categories/:id - Update category
  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a category (Admin only)' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // DELETE /api/categories/:id - Delete category
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a category (Admin only)' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
```

**Why each decorator:**
- `@Controller('categories')` - URL is /api/categories
- `@UseGuards(JwtAuthGuard, RolesGuard)` - Needs login + role check
- `@Post()` - POST request (create)
- `@Get()` - GET request (read)
- `@Patch()` - PATCH request (update)
- `@Delete()` - DELETE request (delete)
- `@Roles(Role.ADMIN)` - Only admin can create/update/delete
- `@Body()` - Get data from request body
- `@Param('id')` - Get ID from URL
- `@Query()` - Get query parameters (?page=1)

---

### Step 5: Create Module

**File:** `src/modules/categories/categories.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
```

**Why:**
- `imports: [PrismaModule]` - Needs database access
- `controllers: []` - This feature's HTTP handlers
- `providers: []` - This feature's services
- `exports: []` - Allow other modules to use CategoriesService

---

### Step 6: Register in AppModule

**File:** `src/app.module.ts`

Add CategoriesModule to the imports array:

```typescript
@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ProductsModule,
    CategoriesModule,  // ADD THIS LINE
  ],
  // ... rest of the file
})
export class AppModule {}
```

**Why:**
- Without this, NestJS won't know about your new module
- The module won't be loaded when app starts

---

### Step 7: Rebuild the App

```bash
npm run build
```

**Why:**
- Compiles TypeScript to JavaScript
- Catches any errors you made

---

## 4. Complete Example: Categories Feature

Here's what your new file structure will look like:

```
src/modules/categories/
├── categories.module.ts
├── categories.controller.ts
├── categories.service.ts
└── dto/
    ├── index.ts
    ├── create-category.dto.ts
    ├── update-category.dto.ts
    └── get-categories.dto.ts
```

### API Endpoints Summary

| Method | URL | Who Can Access |
|--------|-----|----------------|
| GET | /api/categories | Anyone |
| GET | /api/categories?page=1&limit=10 | Anyone |
| GET | /api/categories/:id | Anyone |
| POST | /api/categories | Admin only |
| PATCH | /api/categories/:id | Admin only |
| DELETE | /api/categories/:id | Admin only |

### Example Requests

**Get all categories:**
```
GET http://localhost:5000/api/categories?page=1&limit=10&search=electro
```

**Get one category:**
```
GET http://localhost:5000/api/categories/abc-123
```

**Create category:**
```
POST http://localhost:5000/api/categories
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "name": "Electronics"
}
```

**Update category:**
```
PATCH http://localhost:5000/api/categories/abc-123
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "name": "Electronics & Gadgets"
}
```

**Delete category:**
```
DELETE http://localhost:5000/api/categories/abc-123
Authorization: Bearer <admin-token>
```

---

## 5. Testing Your New API

### Option 1: Using Swagger (Recommended for Beginners)

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:5000/api/docs`
3. Click "Authorize" and enter your JWT token
4. Try each endpoint

### Option 2: Using Postman/Thunder Client

**Get token first:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "password123"
}
```

**Use token for protected routes:**
```
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Quick Checklist

When creating any new CRUD feature:

- [ ] Add model to `prisma/schema.prisma`
- [ ] Run `npx prisma db push`
- [ ] Create DTOs (create, update, get)
- [ ] Create Service (business logic)
- [ ] Create Controller (HTTP endpoints)
- [ ] Create Module (group files)
- [ ] Import Module in `app.module.ts`
- [ ] Run `npm run build`
- [ ] Test with Swagger or Postman

---

## Why This Structure?

This modular structure has many benefits:

1. **Separation of Concerns**
   - Controller = HTTP handling
   - Service = Business logic
   - DTO = Validation

2. **Reusability**
   - Service can be used by multiple controllers
   - Module can be imported anywhere

3. **Testability**
   - Easy to test each part separately
   - Can mock services for testing

4. **Scalability**
   - Easy to add more features
   - Team can work on different modules

5. **Maintainability**
   - Clear structure
   - Easy to find files
   - Easy to debug

---

Happy building! 🚀
