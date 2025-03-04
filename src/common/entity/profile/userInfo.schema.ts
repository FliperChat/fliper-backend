import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { CityResponse } from 'maxmind';
import { IResult } from 'ua-parser-js';
import { BaseEntity } from '../baseEntity.schema';

export type UserInfoType = HydratedDocument<UserInfo>;

@Schema()
export class UserInfo extends BaseEntity {
  @Prop({ type: Types.UUID, ref: 'User', required: true })
  user: User;

  @Prop({ type: Object, required: true })
  location: CityResponse;

  @Prop({ type: Object, required: true })
  device: IResult;

  @Prop({ type: Date, default: Date.now, required: true })
  updatedAt: Date;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
