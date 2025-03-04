import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IResult, UAParser } from 'ua-parser-js';
import { CityResponse, open, Reader } from 'maxmind';
import * as path from 'path';
import { Request } from 'express';

@Injectable()
export class IpgeoService {
  private geoDb: Reader<CityResponse> | null = null;

  constructor() {
    const dbPath = path.join(__dirname, '..', '..', 'storage', 'Geo.mmdb');
    this.loadDatabase(dbPath);
  }

  async loadDatabase(dbPath: string) {
    try {
      this.geoDb = await open(dbPath);
    } catch (error) {
      console.error('Error loading GeoIP database:', error);
    }
  }

  getIp(req: Request): string {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      req.connection?.remoteAddress ||
      req.ip;

    return ip || 'x.x.x.x';
  }

  getUA(req: Request): string {
    const ua = req.headers['user-agent'];

    return ua || '';
  }

  getDevice(userAgent: string): IResult {
    userAgent = userAgent.toLowerCase();
    const parser = new UAParser(userAgent);

    return parser.getResult();
  }

  getLocation(ip: string): CityResponse {
    if (!this.geoDb) {
      throw new HttpException(
        'GeoIP database is not loaded',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const data = this.geoDb.get(ip) as CityResponse;

      return data;
    } catch (error) {
      throw new HttpException('Unable to locate', HttpStatus.NOT_FOUND);
    }
  }
}
