import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CityResponse } from 'maxmind';
import { IResult } from 'ua-parser-js';
import { BaseEntity } from '../baseEntity.schema';

export type UserInfoType = HydratedDocument<UserInfo>;

@Schema({ timestamps: true })
export class UserInfo extends BaseEntity {
  @Prop({ type: Types.UUID, ref: 'User', required: true })
  user: Types.UUID;

  @Prop({ type: Object, required: true })
  location: CityResponse;

  @Prop({ type: Object, required: true })
  device: IResult;

  @Prop({ required: true })
  ip: string;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
