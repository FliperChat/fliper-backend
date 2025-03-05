import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/entity/profile/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '../mailer/mailer.module';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/common/entity/profile/refreshToken.schema';
import {
  UserInfo,
  UserInfoSchema,
} from 'src/common/entity/profile/userInfo.schema';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET_AUTH,
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
    CacheModule.register(),
    MailerModule,
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
