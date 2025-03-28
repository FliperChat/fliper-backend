import { Module } from '@nestjs/common';
import { IpgeoService } from './ipgeo.service';
import { IpgeoController } from './ipgeo.controller';

@Module({
  imports: [],
  providers: [IpgeoService],
  controllers: [IpgeoController],
  exports: [IpgeoService],
})
export class IpgeoModule {}
