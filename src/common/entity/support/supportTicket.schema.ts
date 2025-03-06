import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SupportCategory, SupportStatus } from 'src/common/enum';
import { ISupportResponse } from 'src/common/types';
import { BaseEntity } from '../baseEntity.schema';

export type SupportTicketType = HydratedDocument<SupportTicket>;

@Schema({ timestamps: true })
export class SupportTicket extends BaseEntity {
  @Prop({ type: Types.UUID, ref: 'User', required: true })
  user: Types.UUID;

  @Prop({ type: Types.UUID, ref: 'User' })
  assignedSupport?: Types.ObjectId;

  @Prop({ required: true, enum: SupportCategory })
  category: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    enum: SupportStatus,
    default: SupportStatus.OPEN,
  })
  status: string;

  @Prop({
    type: [Object],
    default: [],
  })
  responses: ISupportResponse[];
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);
