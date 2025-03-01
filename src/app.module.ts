import { Module } from '@nestjs/common';
import { IpgeoModule } from './modules/ipgeo/ipgeo.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './modules/profile/profile.module';

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
    IpgeoModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
