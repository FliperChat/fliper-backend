import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { CityResponse, open, Reader } from 'maxmind';
import * as path from 'path';
import { Location } from 'src/common/types';

@Injectable()
export class IpgeoService {
  private geoDb: Reader<CityResponse> | null = null;

  constructor() {
    // const dbPath = path.join(
    //   __dirname,
    //   '..',
    //   '..',
    //   'storageServer',
    //   'Geo.mmdb',
    // );
    // this.loadDatabase(dbPath);
  }

  async loadDatabase(dbPath: string) {
    try {
      this.geoDb = await open(dbPath);
      console.log('GeoIP database loaded successfully');
    } catch (error) {
      console.error('Error loading GeoIP database:', error);
    }
  }

  getDevice(userAgent: string) {
    userAgent = userAgent.toLowerCase();
    const parser = new UAParser(userAgent);

    return {
      browser: parser.getBrowser(),
      device: parser.getDevice(),
      os: parser.getOS(),
    };
  }

  getLocation(ip: string): Location {
    if (!this.geoDb) {
      throw new HttpException(
        'GeoIP database is not loaded',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const data = this.geoDb.get(ip) as CityResponse;

      return {
        city: data?.city?.names?.en,
        region: data?.subdivisions?.[0]?.names?.en,
        country: data?.country?.names?.en,
        loc: data?.location
          ? {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            }
          : undefined,
      };
    } catch (error) {
      throw new HttpException('Unable to locate', HttpStatus.NOT_FOUND);
    }
  }
}
