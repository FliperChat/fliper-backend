import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseRA } from '../baseRA.schema';

export type ReelType = HydratedDocument<Reel>;

@Schema()
export class Reel extends BaseRA {
  @Prop()
  videoName?: string;
}

export const ReelSchema = SchemaFactory.createForClass(Reel);
