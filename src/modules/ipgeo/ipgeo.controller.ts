import { Controller, Get, HttpCode, HttpStatus, Ip, Req } from '@nestjs/common';
import { Request } from 'express';
import { IpgeoService } from './ipgeo.service';

@Controller('ipgeo')
export class IpgeoController {
  constructor(private readonly geoService: IpgeoService) {}

  @Get('track')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: Request) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      req.connection?.remoteAddress ||
      req.ip;
    const userAgent = req.headers['user-agent'] || '';

    return {
      ip,
      device: this.geoService.getDevice(userAgent),
      location: { ...this.geoService.getLocation(ip as string) },
    };
  }
}
