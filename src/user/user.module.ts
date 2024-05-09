import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../shared/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { configDotenv } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/shared/repositories/user.repository';

configDotenv();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [UserService, UserRepository, AuthService],
  controllers: [UserController],
})
export class UserModule {}
