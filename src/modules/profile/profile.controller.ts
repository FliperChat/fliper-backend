import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { SignInDTO, SignUpDTO } from '../../common/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MailerService } from '../mailer/mailer.service';

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
}
