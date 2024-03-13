import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DiaryModule } from './diary/diary.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { ImageModule } from './image/image.module';
import { PlannerModule } from './planner/planner.module';
import { configDotenv } from 'dotenv';

configDotenv();

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
    DiaryModule,
    LikeModule,
    CommentModule,
    ImageModule,
    PlannerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
