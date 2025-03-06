import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from '../baseEntity.schema';

export type MessageType = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message extends BaseEntity {
  @Prop()
  content?: string;

  @Prop({ default: false })
  edited: boolean;

  @Prop({ default: false })
  read: boolean;

  @Prop({ type: Types.UUID, ref: 'User', required: true })
  sender: Types.UUID;

  @Prop({
    type: [{ type: Types.UUID, ref: 'MessageStorage' }],
  })
  messageStorage: Types.UUID;

  @Prop({
    type: [String],
    default: [],
  })
  filesName?: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
