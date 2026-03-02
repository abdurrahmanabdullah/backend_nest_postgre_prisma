import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MailConfig {
  mailer: string;
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: string;
  fromAddress: string;
  fromName: string;
}

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  get mail(): MailConfig {
    return {
      mailer: this.configService.get<string>('MAIL_MAILER') || 'smtp',
      host:
        this.configService.get<string>('MAIL_HOST') ||
        'email-smtp.us-east-1.amazonaws.com',
      port: this.configService.get<number>('MAIL_PORT') || 587,
      username:
        this.configService.get<string>('MAIL_USERNAME') ||
        'AKIAXPDVVYJLVKWQLTEM',
      password:
        this.configService.get<string>('MAIL_PASSWORD') ||
        'BD6IOZmdz/iHjMC88lmIyJXgX5js/jFlxwdbbi1Y9sBr',
      encryption: this.configService.get<string>('MAIL_ENCRYPTION') || 'tls',
      fromAddress:
        this.configService.get<string>('MAIL_FROM_ADDRESS') ||
        'noreply@mail.k.com',
      fromName: this.configService.get<string>('MAIL_FROM_NAME') || 'KTTravel',
    };
  }
}
