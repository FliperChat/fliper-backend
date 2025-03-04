import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from './baseEntity.schema';

@Schema({ timestamps: true })
export class BaseRA extends BaseEntity {
  @Prop({ maxlength: 250, required: true })
  description: string;

  @Prop({ type: Date })
  premiumExpires: Date;

  @Prop({ type: Boolean, default: false })
  blocked: boolean;

  @Prop({ type: [String], default: [] })
  restrictedCountries: string[];

  @Prop({ type: Map, of: Date, default: {} })
  viewedBy: Map<string, Date>;

  @Prop({ type: Types.UUID, ref: 'User', required: true })
  createdBy: Types.UUID;

  @Prop({ type: [Types.UUID], ref: 'User', default: [] })
  likes: Types.UUID[];

  @Prop({ type: [Types.UUID], ref: 'User', default: [] })
  favorites: Types.UUID[];

  @Prop({ type: [{ type: Types.UUID, ref: 'Comment' }], default: [] })
  comments: Types.UUID[];
}
