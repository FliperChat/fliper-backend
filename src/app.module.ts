import { Module } from '@nestjs/common';
import { IpgeoModule } from './modules/ipgeo/ipgeo.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '..', '.env'),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'storage'),
    }),
    IpgeoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
