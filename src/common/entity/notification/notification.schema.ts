import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NotificationType as NT } from 'src/common/enum';

export type NotificationType = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  from: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  to: Types.ObjectId;

  @Prop({ type: String, enum: NT, required: true })
  type: NotificationType;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: false })
  post?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Reels', required: false })
  reels?: Types.ObjectId;

  @Prop({ type: Date, default: Date.now, required: false })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
