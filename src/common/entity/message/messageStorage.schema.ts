import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageStorageType = HydratedDocument<MessageStorage>;

@Schema()
export class MessageStorage {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Users' }], default: [] })
  users: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
  messages: Types.ObjectId[];
}

export const MessageStorageSchema =
  SchemaFactory.createForClass(MessageStorage);
