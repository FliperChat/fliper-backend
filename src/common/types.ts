import { Types } from 'mongoose';

export interface ITokenData {
  _id: Types.UUID;
  email: string;
}
