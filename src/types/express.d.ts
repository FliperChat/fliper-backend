import { Request } from 'express';
import { ITokenData } from '../common/types';

declare module 'express' {
  export interface Request {
    tokenData?: ITokenData;
  }
}
