import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { Diary } from '../shared/entities/diary.entity';
import { DiaryImage } from './entities/diaryImage.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/shared/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { DiaryRepository } from 'src/shared/repositories/diary.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { DiaryImageRepository } from 'src/shared/repositories/diaryImage.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Diary, DiaryImage]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [DiaryService, DiaryRepository, DiaryImageRepository, UserService, UserRepository, AuthService],
  controllers: [DiaryController],
})
export class DiaryModule {}
