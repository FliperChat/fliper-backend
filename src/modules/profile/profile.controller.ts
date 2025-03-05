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
  @UseInterceptors(FileInterceptor('imageFile'))
  async register(
    @Body() auth: SignUpDTO,
    @UploadedFile() file: Express.Multer.File,
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
      'Registered',
      'ConfirmEmail',
      { url: 'test' },
    );

    return user.token;
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

  @Get('profile')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async profile(@Req() req: Request) {
    return await this.profileService.profile(req);
  }
}
