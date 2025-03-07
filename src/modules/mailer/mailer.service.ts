import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: { [name: string]: any },
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      throw new HttpException('Error sending email', HttpStatus.BAD_REQUEST);
    }
  }
}
