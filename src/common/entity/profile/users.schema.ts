import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../../enum';
import { UserInfo } from './userInfo.schema';
import { RefreshToken } from './refreshToken.schema';

export type UsersType = HydratedDocument<Users>;

@Schema()
export class Users {
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
    type: [{ type: Types.ObjectId, ref: 'UserInfo', default: [] }],
  })
  userInfo: UserInfo[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'RefreshToken', default: [] }],
  })
  refreshToken: RefreshToken[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Users' }],
    default: [],
  })
  followers: Users[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Users' }],
    default: [],
  })
  following: Users[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }], default: [] })
  notifications: Notification[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
