import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ErrorSeverity, ErrorStatus } from 'src/common/enum';
import { BaseEntity } from '../baseEntity.schema';

export type ErrorLogType = HydratedDocument<ErrorLog>;

@Schema({ timestamps: true })
export class ErrorLog extends BaseEntity {
  @Prop({ required: true })
  actionType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: false, type: Types.UUID, ref: 'User' })
  userId: Types.UUID;

  @Prop({ type: String, enum: ErrorSeverity, default: ErrorSeverity.LOW })
  severity: ErrorSeverity;

  @Prop({ type: String, enum: ErrorStatus, default: ErrorStatus.OPEN })
  status: ErrorStatus;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);
