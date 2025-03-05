import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import { MailerService } from './mailer.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT as string),
          secure: true,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: `"Fliper" <${process.env.MAIL_USER}>`,
        },
        template: {
          dir: path.join(__dirname, '..', '..', 'emailPages'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
