import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Diary } from './diary.schema';

export type DiaryImageDocument = DiaryImage & Document;

@Schema()
export class DiaryImage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Diary', required: true })
  diaryId: Diary;

  @Prop({ required: true, trim: true })
  imageUrl: string;
}

export const DiaryImageSchema = SchemaFactory.createForClass(DiaryImage);
