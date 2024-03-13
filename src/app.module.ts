import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DiaryModule } from './diary/diary.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { ImageModule } from './image/image.module';
import { PlannerModule } from './planner/planner.module';
import { configDotenv } from 'dotenv';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';

configDotenv();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASS,
      },
    }),
    UserModule,
    DiaryModule,
    LikeModule,
    CommentModule,
    ImageModule,
    PlannerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
