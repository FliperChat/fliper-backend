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

  /**
   * Method of data retrieval from the database
   *
   * @private
   * @param {string} dbPath - Path to the location base.
   */
  private async loadDatabase(dbPath: string) {
    try {
      this.geoDb = await open(dbPath);
    } catch (error) {
      console.error('Error loading GeoIP database:', error);
    }
  }

  /**
   * Getting user's IP
   *
   * @public
   * @param {Request} req - Request data.
   * @returns {string} - User Ip.
   */
  getIp(req: Request): string {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      req.connection?.remoteAddress ||
      req.ip;

    return ip || 'x.x.x.x';
  }

  /**
   * Getting user agent of user from browser
   *
   * @public
   * @param {Request} req - Request data.
   * @returns {string} - User agent of the user.
   */
  getUA(req: Request): string {
    const ua = req.headers['user-agent'];

    return ua || '';
  }

  /**
   * Retrieving browser and user system data from the browser
   *
   * @public
   * @param {string} userAgent - User agent of the user.
   * @returns {IResult} - Browser and system data.
   */
  getDevice(userAgent: string): IResult {
    userAgent = userAgent.toLowerCase();
    const parser = new UAParser(userAgent);

    return parser.getResult();
  }

  /**
   * Obtaining user geolocation data
   *
   * @public
   * @param {string} ip - User Ip.
   * @returns {CityResponse} - Geolocation data.
   */
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

  /**
   * Retrieving all possible user data
   *
   * @public
   * @param {Request} req - Request data.
   * @returns {Object} - User Data.
   */
  getFullData(req: Request) {
    const ua = this.getUA(req);
    const ip = this.getIp(req);
    const device = this.getDevice(ua);
    const location = this.getLocation(ip);

    return { ip, device, location, ua };
  }
}
