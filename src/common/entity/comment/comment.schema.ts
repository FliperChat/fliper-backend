import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from '../baseEntity.schema';

export type CommentType = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment extends BaseEntity {
  @Prop({ required: true, maxlength: 150 })
  content: string;

  @Prop({ type: Types.UUID, ref: 'User', required: true })
  createdBy: Types.UUID;

  @Prop({ type: [Types.UUID], ref: 'User', default: [] })
  likes: Types.UUID[];

  @Prop({ type: [{ type: Types.UUID, ref: 'Comment' }], default: [] })
  replies: Types.UUID[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
