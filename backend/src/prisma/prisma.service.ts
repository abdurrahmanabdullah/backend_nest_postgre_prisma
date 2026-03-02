// src/prisma/prisma.service.ts
import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private isShutdownHandlerRegistered = false;

  constructor() {
    super({
      log: ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // Initialize client extensions for soft delete
    const softDeleteExtension = Prisma.defineExtension((client) => {
      return client.$extends({
        query: {
          $allModels: {
            async findUnique({ args, query }) {
              // Only add deletedAt: null if it's not explicitly set
              if (
                args.where &&
                !Object.keys(args.where).includes('deletedAt')
              ) {
                args.where = { ...args.where, deletedAt: null };
              }
              return query(args);
            },
            async findFirst({ args, query }) {
              if (
                args.where &&
                !Object.keys(args.where).includes('deletedAt')
              ) {
                args.where = { ...args.where, deletedAt: null };
              }
              return query(args);
            },
            async findMany({ args, query }) {
              if (
                !args.where ||
                !Object.keys(args.where).includes('deletedAt')
              ) {
                args.where = { ...args.where, deletedAt: null };
              }
              return query(args);
            },
            async count({ args, query }) {
              if (
                !args.where ||
                !Object.keys(args.where).includes('deletedAt')
              ) {
                args.where = { ...args.where, deletedAt: null };
              }
              return query(args);
            },
            async delete({ model, args }) {
              return client[model].update({
                ...args,
                data: {
                  deletedAt: new Date(),
                },
              });
            },
            async deleteMany({ model, args }) {
              return client[model].updateMany({
                ...args,
                data: {
                  deletedAt: new Date(),
                },
              });
            },
          },
        },
      });
    });

    // Apply the extension
    this.$extends(softDeleteExtension);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    if (this.isShutdownHandlerRegistered) return;

    // Handle process termination and cleanup
    const signals = ['SIGINT', 'SIGTERM', 'SIGUSR2'] as const;

    for (const signal of signals) {
      process.on(signal, async () => {
        await this.$disconnect();
        await app.close();
        process.exit(0);
      });
    }

    this.isShutdownHandlerRegistered = true;
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    try {
      const modelNames = Reflect.ownKeys(PrismaClient.prototype).filter(
        (key) => {
          return (
            typeof key === 'string' &&
            !key.startsWith('$') &&
            !['_', 'constructor'].includes(key) &&
            typeof this[key] === 'object' &&
            this[key] !== null &&
            'deleteMany' in this[key]
          );
        },
      );

      return Promise.all(
        modelNames.map((modelName) => this[modelName as string].deleteMany()),
      );
    } catch (error) {
      console.error('Error cleaning database:', error);
      throw error;
    }
  }
}
