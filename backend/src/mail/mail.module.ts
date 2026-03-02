// src/mail/mail.module.ts
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { MailProcessor } from './mail.processor';

@Module({
  imports: [ConfigModule, PrismaModule],
})
export class MailModule {}
