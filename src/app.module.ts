import { Module } from '@nestjs/common';
import { IpgeoModule } from './modules/ipgeo/ipgeo.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './modules/profile/profile.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '..', '.env'),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'resources'),
      serveRoot: '/assets',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, './i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ],
    }),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET_AUTH,
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
    IpgeoModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
