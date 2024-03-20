import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Diary, DiarySchema } from './schema/diary.schema';
import { DiaryImage, DiaryImageSchema } from './schema/diaryImage.schema';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Diary.name, schema: DiarySchema },
      { name: DiaryImage.name, schema: DiaryImageSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [DiaryService, UserService],
  controllers: [DiaryController],
})
export class DiaryModule {}
