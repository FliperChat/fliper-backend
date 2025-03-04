import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { IpgeoService } from './ipgeo.service';

@Controller('ipgeo')
export class IpgeoController {
  constructor(private readonly geoService: IpgeoService) {}

  @Get('track')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: Request) {
    const ip = this.geoService.getIp(req);
    const userAgent = this.geoService.getUA(req);

    return {
      ip,
      device: this.geoService.getDevice(userAgent),
      location: this.geoService.getLocation(ip as string),
    };
  }
}
