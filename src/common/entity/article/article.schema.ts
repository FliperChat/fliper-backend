import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseRA } from '../baseRA.schema';

export type ArticleType = HydratedDocument<Article>;

@Schema()
export class Article extends BaseRA {
  @Prop({ type: [String], default: [] })
  imageNames?: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
