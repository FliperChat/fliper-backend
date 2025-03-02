import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageType = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  content?: string;

  @Prop({ default: false })
  edited: boolean;

  @Prop({ type: Date, default: Date.now, required: true })
  dateCreated: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Users' }], default: [] })
  users: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'MessageStorage' }],
  })
  messageStorage: Types.ObjectId;

  @Prop({
    default: [],
  })
  filesName?: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
