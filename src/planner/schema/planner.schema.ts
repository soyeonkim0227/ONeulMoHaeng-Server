import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type PlannerDocument = Planner & Document;

@Schema()
export class Planner {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.Date, required: true, trim: true })
  date: Date;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    required: true,
    default: false,
    trim: true,
  })
  isFinished: boolean;

  @Prop({ type: mongoose.Schema.Types.String, required: true, trim: true })
  content: string;
}

export const PlannerSchema = SchemaFactory.createForClass(Planner);
