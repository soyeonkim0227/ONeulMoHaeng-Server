import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/shared/entities/user.entity';
import { Diary } from 'src/shared/entities/diary.entity';
import { DiaryImage } from 'src/shared/entities/diaryImage.entity';
import { DiaryRepository } from 'src/shared/repositories/diary.repository';
import { DiaryImageRepository } from 'src/shared/repositories/diaryImage.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Diary, DiaryImage]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [
    DiaryService,
    DiaryRepository,
    DiaryImageRepository,
    UserService,
    UserRepository,
    AuthService,
  ],
  controllers: [DiaryController],
})
export class DiaryModule {}
