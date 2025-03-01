import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import { MailerService } from './mailer.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: 'smtp.ukr.net',
        port: 2525,
        secure: true,
        auth: {
          user: 'uniwox@ukr.net',
          pass: 'vnd1B2BZgt6chIX2',
        },
      },
      defaults: {
        from: `"Fliper" <uniwox@ukr.net>`,
      },
      template: {
        dir: path.join(__dirname, '..', '..', 'storage', 'pages'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
