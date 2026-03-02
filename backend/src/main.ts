// src/main.ts
// import { QueueService } from '@/queue/queue-consumer.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable raw body parsing
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  // Body parsing
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));

  // Create postfix routes before setting global prefix
  const postfixRouter = express.Router();

  // Apply the router before the global prefix
  app.use(postfixRouter);

  // Global prefix - must come after webhook middleware
  app.setGlobalPrefix('api');

  app.use((req, res, next) => {
    // logger.log('Incoming request:', req.method, req.path);
    // logger.log('Request body:', req.body);
    // logger.log('Request headers:', req.headers);
    next();
  });

  app.use((err, req, res, next) => {
    console.error('Error in request:', err);
    next(err);
  });

  // app.useGlobalFilters(new AllExceptionsFilter());

  // Global pipes and middleware
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false,
      },
    }),
  );

  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  // Enable shutdown hooks
  await prismaService.enableShutdownHooks(app);

  // Enable CORS
  app.enableCors({
    // origin: configService.get('FRONTEND_URL'),
    // origin: '*',
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  app.use(cookieParser());


  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('KTTravel Backend API')
    .setDescription('API documentation for KTTravel')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 5000;

  // Ensure admin user has admin role (Fix for 403)
  try {
    await prismaService.user.updateMany({
      where: { email: 'admin1@gmail.com' },
      data: { role: 'admin' },
    });
    console.log('Ensured admin1@gmail.com has admin role.');
  } catch (e) {
    console.error('Failed to update admin role:', e);
  }

  await app.listen(port);

  // console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
