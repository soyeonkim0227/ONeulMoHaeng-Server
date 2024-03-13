import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Diary } from 'src/diary/schema/diary.schema';
import { User } from 'src/user/schema/user.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Diary', required: true })
  diaryId: Diary;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  updateAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
