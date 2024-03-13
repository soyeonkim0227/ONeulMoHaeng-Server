import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type DiaryDocument = Diary & Document;

@Schema()
export class Diary {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Boolean, required: true, default: false })
  isShown: boolean;

  @Prop({ trim: true })
  repImageUrl: string;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
