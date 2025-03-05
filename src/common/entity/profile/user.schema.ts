import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../../enum';
import { UserInfo } from './userInfo.schema';
import { RefreshToken } from './refreshToken.schema';
import { BaseEntity } from '../baseEntity.schema';

export type UserType = HydratedDocument<User>;

@Schema()
export class User extends BaseEntity {
  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  login: string;

  @Prop({
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: Boolean, default: false, required: true })
  emailVerified: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ trim: true, required: true })
  phone: string;

  @Prop({ trim: true, unique: true })
  image: string;

  @Prop({ type: Date, default: Date.now, required: true })
  registrationDate: Date;

  @Prop({ type: Date, required: true })
  birthDay: Date;

  @Prop({ type: Date })
  premiumExpires: Date;

  @Prop({ type: String, enum: Role, default: Role.USER, required: true })
  role: Role;

  @Prop({ type: Boolean, default: false, required: true })
  private: boolean;

  @Prop({ type: Boolean, default: false, required: true })
  verified: boolean;

  @Prop()
  description: string;

  @Prop({
    type: [{ type: Types.UUID, ref: 'UserInfo', default: [] }],
  })
  userInfo: UserInfo[];

  @Prop({
    type: [{ type: Types.UUID, ref: 'RefreshToken', default: [] }],
  })
  refreshToken: RefreshToken[];

  @Prop({
    type: [{ type: Types.UUID, ref: 'User' }],
    default: [],
  })
  followers: User[];

  @Prop({
    type: [{ type: Types.UUID, ref: 'User' }],
    default: [],
  })
  following: User[];

  @Prop({ type: [{ type: Types.UUID, ref: 'Notification' }], default: [] })
  notifications: Notification[];
}

export const UserSchema = SchemaFactory.createForClass(User);
