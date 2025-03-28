import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  /**
   * Sending a message for a user to mail by template
   *
   * @public
   * @param {string} to - Send to.
   * @param {string} subject - Message Subject.
   * @param {string} template - The name of the page template.
   * @param {[name: string]: any} context - Parameters to put in the letter on the template.
   */
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
        attachments: [
          {
            path: join(__dirname, '..', '..', 'assets', 'images', 'banner.png'),
            cid: 'banner',
            contentDisposition: 'inline',
            contentType: 'image/png',
            filename: 'banner.png',
            headers: {
              'Content-Transfer-Encoding': 'base64',
              'Content-Disposition': 'inline',
            },
          },
        ],
      });
    } catch (error) {
      throw new HttpException(
        'Error sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
