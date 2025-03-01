import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../enum';

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

  @Prop({ type: String, enum: Role, default: Role.USER, required: true })
  role: Role;

  @Prop({ type: Boolean, default: false, required: true })
  private: boolean;

  @Prop({ type: Boolean, default: false, required: true })
  verified: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
