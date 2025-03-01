import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from './users.schema';
import { Device, Location } from 'src/common/types';

export type UserInfoType = HydratedDocument<UserInfo>;

@Schema()
export class UserInfo {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user: Users;

  @Prop({ type: Object, required: true })
  location: Location;

  @Prop({ type: Object, required: true })
  device: Device;

  @Prop({ type: Date, default: Date.now, required: true })
  updatedAt: Date;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
