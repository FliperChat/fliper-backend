import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  ConfForgetPassDTO,
  SignInDTO,
  SignUpDTO,
} from '../../common/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MailerService } from '../mailer/mailer.service';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body() auth: SignInDTO) {
    const token = await this.profileService.login(auth);

    return token;
  }

  @Post('signup')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('image'))
  async register(
    @Body() auth: SignUpDTO,
    @UploadedFile() file: Express.Multer.File,
    @I18n() i18n: I18nContext,
  ) {
    const user = await this.profileService.register(auth);

    if (file) {
      const imageName = await this.profileService.saveImage(
        file,
        user._id.toString(),
      );

      await this.profileService.updateUserImg(user._id, imageName);
    }

    await this.mailerService.sendMail(
      user.email,
      i18n.t('email.confirm_email.title'),
      'ConfirmEmail',
      {
        url:
          process.env.SITE_URL + '/accounts/confirm/profile?at=' + user.token,
        email: process.env.MAIL_SUPPORT,
        btn1: i18n.t('email.confirm_email.btn1'),
        btn2: i18n.t('email.confirm_email.btn2'),
        text0: i18n.t('email.confirm_email.text0'),
        text1: i18n.t('email.confirm_email.text1'),
        text2: i18n.t('email.confirm_email.text2'),
        text3: i18n.t('email.confirm_email.text3'),
        text4_1: i18n.t('email.confirm_email.text4_1'),
        text4_2: i18n.t('email.confirm_email.text4_2'),
        text5: i18n.t('email.confirm_email.text5'),
        text6: i18n.t('email.confirm_email.text6'),
        text7: i18n.t('email.confirm_email.text7'),
        text8: i18n.t('email.confirm_email.text8'),
        text9: i18n.t('email.confirm_email.text9'),
      },
    );

    return true;
  }

  @Post('confirm-reg')
  @HttpCode(HttpStatus.ACCEPTED)
  async confirmRegistration(@Query('token') token: string) {
    const { token: tokenAuth, email } =
      await this.profileService.confirmRegistration(token);

    await this.mailerService.sendMail(
      email,
      'Confirm Registration',
      'ConfirmEmail',
      {},
    );

    return tokenAuth;
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.ACCEPTED)
  async forgetPassword(@Query('email') email: string) {
    const token = await this.profileService.forgetPassword(email);

    await this.mailerService.sendMail(
      email,
      'Confirm Registration',
      'ConfirmEmail',
      {},
    );

    return token;
  }

  @Put('forget-password')
  @HttpCode(HttpStatus.ACCEPTED)
  async confirmForgetPassword(@Body() dto: ConfForgetPassDTO) {
    const email = await this.profileService.confirmForgetPassword(dto);

    await this.mailerService.sendMail(
      email,
      'Confirm Registration',
      'ConfirmEmail',
      {},
    );

    return true;
  }

  @Get('m-profile')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async profile(@Req() req: Request) {
    return await this.profileService.profile(req);
  }
}
