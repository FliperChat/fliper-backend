import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReportReasonType, ReportTargetType } from 'src/common/enum';
import { BaseEntity } from '../baseEntity.schema';

export type ReportType = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report extends BaseEntity {
  @Prop({ required: true, enum: ReportTargetType })
  targetType: ReportTargetType;

  @Prop({ required: true, type: Types.UUID, refPath: 'targetType' })
  targetId: Types.UUID;

  @Prop({ required: true, type: Types.UUID, ref: 'User' })
  reportedBy: Types.UUID;

  @Prop({ required: true, enum: ReportReasonType })
  reason: ReportReasonType;

  @Prop({ default: false })
  resolved: boolean;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
