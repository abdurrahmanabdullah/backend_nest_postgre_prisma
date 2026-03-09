# Complete Backend Guide - File by File Explanation

This document explains EVERY single file in this backend project. Designed for complete beginners.

---

## Table of Contents

1. [Entry Point - How the Server Starts](#1-maints---server-entry-point)
2. [App Module - Connecting Everything](#2-appmodulets---root-module)
3. [Database - Prisma](#3-database-prisma)
4. [Authentication System](#4-authentication-system)
5. [Products Module](#5-products-module)
6. [Users Module](#6-users-module)
7. [Config Module](#7-config-module)
8. [Common/Utils](#8-common--utils)
9. [How Everything Connects](#9-how-everything-connects)

---

## 1. main.ts - Server Entry Point

**File Location:** `src/main.ts`

**What it does:** This is where the server starts. It's the FIRST file that runs when you start the app.

**Line by line explanation:**

```typescript
import { ValidationPipe } from '@nestjs/common';
// ValidationPipe - automatically checks if incoming data is valid
// Example: If email is required but client sends empty, it rejects automatically

import { ConfigService } from '@nestjs/config';
// ConfigService - lets us read .env file (environment variables)

import { NestFactory } from '@nestjs/core';
// NestFactory - creates the NestJS application

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// SwaggerModule - creates API documentation (the /api/docs page)

import * as cookieParser from 'cookie-parser';
// cookieParser - reads cookies from browser requests

import { AppModule } from './app.module';
// AppModule - the main module that connects everything

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// HttpExceptionFilter - handles errors and returns nice error messages

import { PrismaService } from './prisma/prisma.service';
// PrismaService - our database connection
```

**The bootstrap function (what happens when server starts):**

```typescript
async function bootstrap() {
  // 1. Create the NestJS app
  const app = await NestFactory.create(AppModule, {
    rawBody: true,  // Needed for webhook signatures
  });

  // 2. Get ConfigService to read .env
  const configService = app.get(ConfigService);

  // 3. Apply global error handler
  app.useGlobalFilters(new HttpExceptionFilter());
  // Any error in the app will be caught and formatted nicely

  // 4. Parse incoming data (JSON, form data)
  app.use(express.json({ limit: '5mb' }));      // Allow 5MB JSON data
  app.use(express.urlencoded({ limit: '5mb', extended: true }));

  // 5. Set global prefix - all routes start with /api
  app.setGlobalPrefix('api');
  // So /users becomes /api/users

  // 6. Validation Pipe - validates all incoming data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Remove extra fields not in DTO
      transform: true,           // Convert data types (string to number)
      forbidNonWhitelisted: true, // Error if unknown fields sent
    }),
  );

  // 7. Enable CORS - allow browsers to access API
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(','),  // Allow these websites
    credentials: true,              // Allow cookies
  });

  // 8. Setup Swagger (API Documentation)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('KTTravel Backend API')
    .setDescription('API documentation for KTTravel')
    .setVersion('1.0')
    .addBearerAuth()  // Add JWT auth button to Swagger
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);  // Available at /api/docs

  // 9. Start server
  const port = configService.get<number>('PORT') || 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
```

**What this means for you:**
- Server runs on port 5000
- All routes start with `/api` (e.g., `/api/users`)
- API docs available at `http://localhost:5000/api/docs`
- All input data is automatically validated
- Errors return nice JSON messages

---

## 2. app.module.ts - Root Module

**File Location:** `src/app.module.ts`

**What it does:** This is the MAIN module that connects all other modules together. Think of it as the table of contents for your app.

```typescript
// Import NestJS decorators
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

// Import our feature modules
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/modules/users/user.module';
import { ProductsModule } from './modules/products/products.module';

// Import authentication
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AuthMiddleware } from '@/auth/middleware/auth.middleware';
import { AppConfigService } from '@/config/app-config.service';
import { AppConfigModule } from '@/config/app-config.module';

@Module({
  imports: [
    // 1. AppConfigModule - reads .env file (must be first)
    AppConfigModule,

    // 2. PrismaModule - database connection (global - available everywhere)
    PrismaModule,

    // 3. Feature modules - each feature has its own module
    AuthModule,       // Login, registration
    UserModule,      // User management
    ProductsModule,  // Product management
  ],
  providers: [
    // Global guard - applies to ALL routes by default
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,  // Every route needs JWT token
    },
    AppConfigService,
  ],
  exports: [],
})
export class AppModule implements NestModule {
  // Apply middleware to all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    // * means all routes
  }
}
```

**Summary:** This file says "Here are all the modules in our app" and "All routes need authentication by default."

---

## 3. Database - Prisma

### 3.1 prisma/schema.prisma - Database Design

**What it does:** Defines what tables exist in the database and what columns they have.

```prisma
// This is your Prisma schema file
generator client {
  provider = "prisma-client-js"  // Generates TypeScript code for database
}

datasource db {
  provider = "postgresql"  // Using PostgreSQL
  url      = env("DATABASE_URL")  // Connection string from .env
}

// User table
model User {
  id        String  @id @default(uuid())  // Primary key, auto-generated UUID
  name      String                           // Required text
  firstName String? @map("first_name")      // Optional, maps to "first_name" in DB
  lastName  String? @map("last_name")
  username  String  @unique                  // Must be unique in database
  email     String  @unique                  // Must be unique
  password  String?                          // Optional (for social login)
  role      String  @default("user")        // Default is "user"
  photo     String?                          // Profile picture URL
  bio       String? @db.Text                 // Long text

  isActive Boolean @default(true) @map("is_active")

  // Location
  latitude    Float?
  longitude   Float?
  countryCode String? @map("country_code")
  language    String?
  timezone    String?

  // Social authentication
  accountProvider String? @map("account_provider")  // "google", "form", etc.
  socialId        String? @map("social_id")
  googleId        String? @map("google_id")
  googleToken     String? @map("google_token")

  // IP tracking
  signInIpAddress String? @map("sign_in_ip_address")
  ipAddress       String? @map("ip_address")
  ipHost          String? @map("ip_host")

  // Timestamps
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")  // For soft delete

  @@map("users")  // Table name in database
}

// Product table
model Product {
  id        String   @id @default(uuid())
  name      String
  details   String?  @db.Text
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@map("products")
}
```

### 3.2 prisma.service.ts - Database Connection

**File Location:** `src/prisma/prisma.service.ts`

**What it does:** Connects our app to the PostgreSQL database.

```typescript
@Injectable()
export class PrismaService
  extends PrismaClient  // Extends Prisma's built-in client
  implements OnModuleInit, OnModuleDestroy {

  constructor() {
    super({
      log: ['error', 'warn'],  // Log errors and warnings
      datasources: {
        db: {
          url: process.env.DATABASE_URL,  // From .env
        },
      },
    });
  }

  // Called when app starts - connect to database
  async onModuleInit() {
    await this.$connect();
  }

  // Called when app stops - disconnect from database
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Graceful shutdown - close database when server stops
  async enableShutdownHooks(app: INestApplication) {
    const signals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
    for (const signal of signals) {
      process.on(signal, async () => {
        await this.$disconnect();
        await app.close();
        process.exit(0);
      });
    }
  }

  // For testing - clear all data
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;
    // Deletes all data from all tables
  }
}
```

### 3.3 prisma.module.ts - Database Module

**File Location:** `src/prisma/prisma.module.ts`

```typescript
@Global()  // Available in ALL modules without importing
@Module({
  providers: [PrismaService],    // The database service
  exports: [PrismaService],      // Other modules can use it
})
export class PrismaModule {}
```

---

## 4. Authentication System

The auth module handles:
- User login
- User registration
- JWT token creation/verification
- Protecting routes

### 4.1 auth.controller.ts - Auth Endpoints

**File Location:** `src/auth/auth.controller.ts`

**What it does:** Defines the API endpoints for login and registration.

```typescript
@ApiTags('Authentication')  // Groups endpoints in Swagger
@Controller('auth')         // URL: /api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/login
  @Public()  // Anyone can access - no login required
  @Post('login')
  @HttpCode(HttpStatus.OK)  // Returns 200 OK
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    // Calls authService.login() with the email/password from request body
    return this.authService.login(loginDto);
  }

  // POST /api/auth/register
  @Public()  // Anyone can access
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<LoginResponse> {
    // Creates new user and returns tokens automatically
    return this.authService.register(registerDto);
  }
}
```

### 4.2 auth.service.ts - Auth Business Logic

**File Location:** `src/auth/auth.service.ts`

**What it does:** The actual logic for login and registration.

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,                    // Creates JWT tokens
    private readonly userRegistrationService: UserRegistrationService,  // Creates users
    private readonly userService: UserService,                  // Finds users
  ) {}

  // LOGIN LOGIC
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    // 1. Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Check password (compare with hashed password)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // 4. Generate JWT tokens
    const tokens = await this.generateAuthTokens(user.id, user.email, user.role);

    // 5. Return user info + tokens
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, photo: user.photo, isActive: user.isActive },
      tokens,
    };
  }

  // REGISTER LOGIC
  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    // 1. Create new user
    const user = await this.userRegistrationService.registerUser({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
    }, 'form');

    // 2. Generate tokens
    const tokens = await this.generateAuthTokens(user.id, user.email, user.role);

    // 3. Return user + tokens
    return { user: {...}, tokens };
  }

  // Generate JWT tokens
  async generateAuthTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };  // Token data
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1d' }),   // Valid for 1 day
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),   // Valid for 7 days
    ]);

    return { accessToken, refreshToken };
  }
}
```

### 4.3 auth.module.ts - Auth Module

**File Location:** `src/auth/auth.module.ts`

```typescript
@Module({
  imports: [
    // Passport handles JWT strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // JWT configuration
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    
    PrismaModule,     // Database
    AppConfigModule,  // Config
    UserModule,       // User service
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

### 4.4 JWT Strategy (How JWT is verified)

**File Location:** `src/auth/strategies/jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Get token from header
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // This runs when a JWT token is verified
  async validate(payload: any) {
    // payload contains: { sub: userId, email, role }
    
    // Find user in database
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Remove password before returning
    const { password, ...result } = user;
    return result;  // This becomes req.user
  }
}
```

### 4.5 Guards (Protecting Routes)

**jwt-auth.guard.ts** - Checks if user is logged in:

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;  // Skip auth for public routes
    return super.canActivate(context);  // Check JWT
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
```

**roles.guard.ts** - Checks if user has correct role:

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;  // No roles required

    const { user } = context.switchToHttp().getRequest();
    
    // Check if user has any of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);
    return hasRole;
  }
}
```

### 4.6 Decorators

**public.decorator.ts** - Marks routes as public (no login needed):

```typescript
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// Usage: @Public() @Get('login') login() {}
```

**roles.decorator.ts** - Specifies required roles:

```typescript
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
// Usage: @Roles(Role.ADMIN) @Get('admin') admin() {}
```

**role.enum.ts** - Defines available roles:

```typescript
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
```

### 4.7 Auth Middleware

**auth.middleware.ts** - Runs before controller:

```typescript
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      next();  // No token, continue
      return;
    }

    try {
      // Extract and verify token
      const token = authHeader.split(' ')[1];  // Remove "Bearer "
      const payload = this.jwtService.verify(token);

      // Get user from database
      const user = await this.userService.findById(payload.sub);
      req['user'] = user;  // Attach user to request

      next();
    } catch (error) {
      next();  // Invalid token, continue anyway (guards will handle)
    }
  }
}
```

### 4.8 Auth DTOs

**auth/dtos/index.ts** - Input validation for auth:

```typescript
// Login - requires email and password
export class LoginDto {
  @Transform(({ value }) => value?.trim().toLowerCase())  // Clean input
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}

// Register - requires name, email, password, passwordConfirmation
export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @Match('password', { message: 'Passwords do not match.' })
  passwordConfirmation: string;
}
```

---

## 5. Products Module

### 5.1 products.controller.ts

**File Location:** `src/modules/products/products.controller.ts`

**What it does:** Handles HTTP requests for products.

```typescript
@ApiTags('Products')        // Swagger tag
@ApiBearerAuth()           // Shows auth button in Swagger
@Controller('products')    // URL: /api/products
@UseGuards(JwtAuthGuard)  // All routes need JWT token
export class ProductsController {
  
  // GET /api/products - Get all products
  @Get()
  findAll(@Query(ValidationPipe) query: GetProductsDto) {
    // ?page=1&limit=10&search=phone
    return this.productsService.findAll(query);
  }

  // GET /api/products/:id - Get one product
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // POST /api/products - Create product (Admin only)
  @Post()
  @Roles(Role.ADMIN)  // Only admins can create
  create(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // PATCH /api/products/:id - Update product (Admin only)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  // DELETE /api/products/:id - Delete product (Admin only)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
```

### 5.2 products.service.ts

**File Location:** `src/modules/products/products.service.ts`

**What it does:** Business logic for products.

```typescript
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Create new product
  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  // Get all products with pagination and search
  async findAll(query: GetProductsDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    // Build search filter
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },  // Case-insensitive
        { details: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Run both queries in parallel for speed
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,        // Limit results
        orderBy: { createdAt: 'desc' },  // Newest first
      }),
      this.prisma.product.count({ where: whereClause }),  // Count total
    ]);

    return {
      products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // Get one product by ID
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Update product
  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);  // Check exists
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  // Delete product
  async remove(id: string) {
    await this.findOne(id);  // Check exists
    return this.prisma.product.delete({ where: { id } });
  }
}
```

### 5.3 Products DTOs

**create-product.dto.ts:**
```typescript
export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Headphones' })
  @IsNotEmpty()  // Required
  @IsString()
  name: string;

  @ApiProperty({ example: 'High-quality headphones' })
  @IsOptional()  // Optional
  @IsString()
  details?: string;
}
```

**get-products.dto.ts:**
```typescript
export class GetProductsDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;  // Default: page 1

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number = 10;  // Default: 10 items

  @IsOptional() @IsString()
  search?: string;  // Search term
}
```

### 5.4 products.module.ts

```typescript
@Module({
  imports: [PrismaModule],              // Needs database
  controllers: [ProductsController],   // Handle HTTP
  providers: [ProductsService],        // Business logic
  exports: [ProductsService],          // Available to other modules
})
export class ProductsModule {}
```

---

## 6. Users Module

### 6.1 user.controller.ts

**File Location:** `src/modules/users/user.controller.ts`

```typescript
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)  // Needs JWT + Role check
export class UserController {
  
  // GET /api/users - Get all users (Admin and User can access)
  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@Query(ValidationPipe) query: FindAllUsersDto) {
    return this.userService.findAll(query);
  }
}
```

### 6.2 user.service.ts

**File Location:** `src/modules/users/services/user.service.ts`

```typescript
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Get all users with search
  async findAll(findAllUsersDto: FindAllUsersDto) {
    const { page = 1, limit = 10, search } = findAllUsersDto;
    const skip = (page - 1) * limit;

    // Search in name, email, username
    const whereClause = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { username: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // Return only specific fields (not password!)
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause as any,
        select: {  // Only return these fields
          id: true,
          name: true,
          email: true,
          role: true,
          photo: true,
          createdAt: true,
          isActive: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: whereClause as any }),
    ]);

    return { users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // Find user by ID
  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Find user by email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```

### 6.3 user-registration.service.ts

**File Location:** `src/modules/users/services/user-registration.service.ts`

**What it does:** Creates new users with proper validation.

Key features:
- Hashes password with bcrypt
- Generates unique username
- First registered user becomes admin automatically
- Generates random password for social login
- Handles duplicate email error

### 6.4 user.module.ts

```typescript
@Module({
  imports: [PrismaModule, UtilsModule],  // Dependencies
  controllers: [UserController],
  providers: [UserService, UserRegistrationService, StringUtilsService],
  exports: [UserService, UserRegistrationService],
})
export class UserModule {}
```

---

## 7. Config Module

### 7.1 app-config.service.ts

**File Location:** `src/config/app-config.service.ts`

**What it does:** Provides easy access to environment variables.

```typescript
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  // Check if running in production
  get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  // Mail configuration
  get mail(): MailConfig {
    return {
      mailer: this.configService.get<string>('MAIL_MAILER') || 'smtp',
      host: this.configService.get<string>('MAIL_HOST') || '',
      // ... more settings
    };
  }

  // JWT configuration
  get jwt() {
    return {
      secret: this.configService.get<string>('JWT_SECRET') || '',
      expiration: this.configService.get<string>('JWT_EXPIRATION') || '1d',
    };
  }
}
```

### 7.2 app-config.module.ts

```typescript
@Global()  // Available everywhere
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Available in all modules
      envFilePath: getEnvPath(),  // Load .env file
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
```

---

## 8. Common / Utils

### 8.1 http-exception.filter.ts

**File Location:** `src/common/filters/http-exception.filter.ts`

**What it does:** Catches errors and returns nice JSON responses.

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
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

Example error response:
```json
{
  "statusCode": 404,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/products/123",
  "message": "Product not found"
}
```

### 8.2 string-utils.service.ts

**What it does:** Helper functions for string manipulation.

```typescript
@Injectable()
export class StringUtilsService {
  toTitleCase(str: string): string { ... }
  toKebabCase(str: string): string { ... }
  // etc.
}
```

### 8.3 match.decorator.ts

**What it does:** Validates that two fields match (like password confirmation).

```typescript
export const Match = (property: string) =>
  RegisterDecorator({
    validate: ({ value }) => value === this.object[property],
    // ...
  });
// Usage: @Match('password') passwordConfirmation: string;
```

---

## 9. How Everything Connects

### Request Flow Example: Client asks for all products

```
1. Browser sends:
   GET http://localhost:5000/api/products?page=1&limit=10
   
2. main.ts receives request
   - ValidationPipe validates query params
   - No errors, continues

3. AppModule routes to ProductsModule

4. JwtAuthGuard checks:
   - Is there a token? Yes/No
   - Is token valid?
   - If public route, skip

5. ProductsController receives:
   @Get() findAll(@Query() query: GetProductsDto)

6. ProductsController calls:
   productsService.findAll(query)

7. ProductsService calls:
   prisma.product.findMany({...})

8. PrismaService talks to PostgreSQL database

9. Database returns products

10. Response goes back:
    Service → Controller → main.ts → Browser

11. Browser receives:
    {
      "products": [...],
      "meta": { "total": 10, "page": 1, "limit": 10 }
    }
```

### Module Dependency Graph

```
AppModule
├── AppConfigModule (reads .env)
├── PrismaModule (database - GLOBAL)
├── AuthModule
│   ├── PassportModule
│   ├── JwtModule
│   ├── PrismaModule
│   └── UserModule
├── UserModule
│   ├── PrismaModule
│   └── UtilsModule
└── ProductsModule
    └── PrismaModule
```

---

## Summary: What Each File Does

| File | Purpose |
|------|---------|
| main.ts | Server entry point, starts the app |
| app.module.ts | Connects all modules |
| prisma.service.ts | Database connection |
| prisma.module.ts | Makes database available globally |
| auth.controller.ts | Login/register endpoints |
| auth.service.ts | Login/register logic |
| jwt.strategy.ts | Verifies JWT tokens |
| jwt-auth.guard.ts | Protects routes (needs login) |
| roles.guard.ts | Protects routes (needs specific role) |
| public.decorator.ts | Makes route public (no login) |
| roles.decorator.ts | Specifies required roles |
| products.controller.ts | Product API endpoints |
| products.service.ts | Product business logic |
| products.module.ts | Groups product files |
| user.controller.ts | User API endpoints |
| user.service.ts | User business logic |
| user-registration.service.ts | Creates new users |
| app-config.service.ts | Reads .env variables |
| http-exception.filter.ts | Handles errors nicely |

---

Happy Learning! 🚀
