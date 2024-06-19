import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeRepository } from 'src/shared/repositories/like.repository';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/shared/entities/user.entity';
import { Like } from 'src/shared/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [LikeService, LikeRepository, AuthService, UserRepository],
  controllers: [LikeController],
})
export class LikeModule {}
