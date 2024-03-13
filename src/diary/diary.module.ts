import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Diary, DiarySchema } from './schema/diary.schema';
import { DiaryImage, DiaryImageSchema } from './schema/diaryImage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Diary.name, schema: DiarySchema },
      { name: DiaryImage.name, schema: DiaryImageSchema },
    ]),
  ],
  providers: [DiaryService],
  controllers: [DiaryController],
})
export class DiaryModule {}
