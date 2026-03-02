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
  implements OnModuleInit, OnModuleDestroy {
  private isShutdownHandlerRegistered = false;
  private _extendedClient: any;

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
    this._extendedClient = this.$extends({
      query: {
        $allModels: {
          async findUnique({ args, query }) {
            if (args.where && !Object.keys(args.where).includes('deletedAt')) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async findFirst({ args, query }) {
            if (args.where && !Object.keys(args.where).includes('deletedAt')) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async findMany({ args, query }) {
            if (!args.where || !Object.keys(args.where).includes('deletedAt')) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async count({ args, query }) {
            if (!args.where || !Object.keys(args.where).includes('deletedAt')) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async delete({ model, args }) {
            return (this as any)[model].update({
              ...args,
              data: {
                deletedAt: new Date(),
              },
            });
          },
          async deleteMany({ model, args }) {
            return (this as any)[model].updateMany({
              ...args,
              data: {
                deletedAt: new Date(),
              },
            });
          },
        },
      },
    });

    // Proxy model access to the extended client
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target._extendedClient && typeof (target._extendedClient as any)[prop] === 'object') {
          return (target._extendedClient as any)[prop];
        }
        return (target as any)[prop];
      },
    }) as any;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    if (this.isShutdownHandlerRegistered) return;

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
            typeof (this as any)[key] === 'object' &&
            (this as any)[key] !== null &&
            'deleteMany' in (this as any)[key]
          );
        },
      );

      return Promise.all(
        modelNames.map((modelName) => (this as any)[modelName as string].deleteMany()),
      );
    } catch (error) {
      console.error('Error cleaning database:', error);
      throw error;
    }
  }
}
