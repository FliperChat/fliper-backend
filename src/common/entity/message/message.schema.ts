import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from '../baseEntity.schema';

export type MessageType = HydratedDocument<Message>;

@Schema()
export class Message extends BaseEntity {
  @Prop()
  content?: string;

  @Prop({ default: false })
  edited: boolean;

  @Prop({ type: Date, default: Date.now, required: true })
  dateCreated: Date;

  @Prop({ type: [{ type: Types.UUID, ref: 'User' }], default: [] })
  users: Types.UUID[];

  @Prop({
    type: [{ type: Types.UUID, ref: 'MessageStorage' }],
  })
  messageStorage: Types.UUID;

  @Prop({
    default: [],
  })
  filesName?: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
