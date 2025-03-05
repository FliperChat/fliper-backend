import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { uuid } from 'uuidv4';

@Schema()
export class BaseEntity {
  @Prop({ type: Types.UUID, default: uuid })
  _id: Types.UUID;
}
