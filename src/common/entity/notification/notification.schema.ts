import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NotificationType as NT } from 'src/common/enum';
import { BaseEntity } from '../baseEntity.schema';

export type NotificationType = HydratedDocument<Notification>;

@Schema()
export class Notification extends BaseEntity {
  @Prop({ type: Types.UUID, ref: 'User', required: true })
  from: Types.UUID;

  @Prop({ type: Types.UUID, ref: 'User', required: true })
  to: Types.UUID;

  @Prop({ type: String, enum: NT, required: true })
  type: NotificationType;

  @Prop({ type: Types.UUID, ref: 'Post', required: false })
  post?: Types.UUID;

  @Prop({ type: Types.UUID, ref: 'Reel', required: false })
  reel?: Types.UUID;

  @Prop({ type: Date, default: Date.now, required: false })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
