import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from '../shared/entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Diary } from 'src/shared/entities/diary.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/shared/entities/user.entity';
import { CommentRepository } from 'src/shared/repositories/comment.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { DiaryRepository } from 'src/shared/repositories/diary.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Comment, Diary]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [CommentService, CommentRepository, UserRepository, DiaryRepository, AuthService],
  controllers: [CommentController],
})
export class CommentModule {}
