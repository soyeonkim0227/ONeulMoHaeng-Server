import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Like } from '../shared/entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like])
  ],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
