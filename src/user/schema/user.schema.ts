import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, trim: true })
  nickname: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ trim: true })
  profileImageUrl: string;

  @Prop({ trim: true })
  short_inform: string;

  @Prop({ trim: true })
  memo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
