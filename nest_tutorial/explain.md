# NestJS Book API - Architecture Explained

This is a beginner-friendly explanation of how this NestJS Book API is structured using best practices.

## Folder Structure

```
src/
├── main.ts                 # App entry point
├── app.module.ts           # Root module
├── database/
│   └── fake-database.ts    # Fake data storage (simulates database)
└── books/                  # Books feature module
    ├── books.module.ts     # Books feature configuration
    ├── books.controller.ts # Handle HTTP requests
    ├── books.service.ts   # Business logic
    ├── dto/                # Data Transfer Objects
    │   ├── create-book.dto.ts
    │   └── update-book.dto.ts
    └── interfaces/
        └── book.interface.ts
```

## Key Concepts

### 1. Modules

- **Purpose**: Organize code into logical blocks
- **BooksModule**: Contains all book-related code
- **AppModule**: Root module that imports BooksModule

### 2. Controllers

- Handle incoming HTTP requests
- Define API endpoints (routes)
- Delegate work to services

### 3. Services

- Contain business logic
- Manage data operations
- Marked with `@Injectable()` decorator

### 4. DTOs (Data Transfer Objects)

- Define shape of data coming in/out
- Use class-validator for validation
- `CreateBookDto`: For creating new books
- `UpdateBookDto`: For updating existing books (all fields optional)

### 5. Interfaces

- Define TypeScript types
- `Book` interface describes the book object structure

## API Endpoints

| Method | Endpoint   | Description          |
| ------ | ---------- | -------------------- |
| GET    | /books     | Get all books        |
| GET    | /books/:id | Get book by ID       |
| POST   | /books     | Create new book      |
| PUT    | /books/:id | Update existing book |
| DELETE | /books/:id | Delete a book        |

## Validation

The API uses class-validator with these rules:

- `title`: Must be a string
- `author`: Must be a string
- `publicationYear`: Must be an integer between 1000 and current year

## Global Pipes

In `main.ts`, we use `ValidationPipe` with:

- `whitelist: true` - Strip properties not in DTO
- `forbidNonWhitelisted: true` - Throw error if extra properties
- `transform: true` - Transform payloads to DTO instances

## How to Run

```bash
# Install dependencies
npm install

# Run in development
npm run start:dev

# Build
npm run build

# Run production build
npm run start:prod
```

## Example Requests

http://localhost:3000/api#/

### Get all books

```bash
GET http://localhost:3000/books
```

### Get single book

```bash
GET http://localhost:3000/books/1
```

### Create book

```bash
POST http://localhost:3000/books
Content-Type: application/json

{
  "title": "New Book",
  "author": "Author Name",
  "publicationYear": 2024
}
```

### Update book

```bash
PUT http://localhost:3000/books/1
Content-Type: application/json

{
  "title": "Updated Title"
}
```

### Delete book

```bash
DELETE http://localhost:3000/books/1
```

## Best Practices Applied

1. **Separation of Concerns**: Controller handles HTTP, Service handles logic
2. **Feature Modules**: Books code in its own module
3. **DTOs**: Clear input/output validation
4. **TypeScript Interfaces**: Strong typing throughout
5. **Validation Pipes**: Automatic request validation
6. **Proper HTTP Status Codes**: 200, 201, 204, 404
7. **ParseIntPipe**: Automatically converts string params to numbers
8. **Descriptive Error Messages**: NotFoundException with meaningful messages
