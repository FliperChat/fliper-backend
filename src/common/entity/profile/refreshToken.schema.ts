import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { BaseEntity } from '../baseEntity.schema';

export type RefreshTokenType = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken extends BaseEntity {
  @Prop({ type: Types.UUID, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Date, default: Date.now, required: true })
  createdAt: Date;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    required: true,
  })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
