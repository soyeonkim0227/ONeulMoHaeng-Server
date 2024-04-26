import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DiaryModule } from './diary/diary.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { ImageModule } from './image/image.module';
import { configDotenv } from 'dotenv';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';

configDotenv();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/entity/*.js'],
      synchronize: false,
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
      autoLoadEntities: true,
    }),
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
