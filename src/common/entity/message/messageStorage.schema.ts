import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from '../baseEntity.schema';

export type MessageStorageType = HydratedDocument<MessageStorage>;

@Schema()
export class MessageStorage extends BaseEntity {
  @Prop({ type: [{ type: Types.UUID, ref: 'User' }], default: [] })
  users: Types.UUID[];

  @Prop({ type: [{ type: Types.UUID, ref: 'Message' }], default: [] })
  messages: Types.UUID[];
}

export const MessageStorageSchema =
  SchemaFactory.createForClass(MessageStorage);
