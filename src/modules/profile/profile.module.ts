import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/common/entity/profile/users.schema';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
    MailerModule,
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
