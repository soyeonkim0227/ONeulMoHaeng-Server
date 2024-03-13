import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Diary } from 'src/diary/schema/diary.schema';
import { User } from 'src/user/schema/user.schema';

export type LikeDocument = Like & Document;

@Schema()
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Diary', required: true })
  diaryId: Diary;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
