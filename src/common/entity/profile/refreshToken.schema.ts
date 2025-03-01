import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from './users.schema';

export type RefreshTokenType = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user: Users;

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
