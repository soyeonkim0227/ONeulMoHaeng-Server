import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like) private readonly likeEntity: Repository<Like>,
  ) {}

  async addLike(userId: number, diaryId: number) {
    const like = new Like();

    like.diaryId = diaryId;
    like.userId = userId;

    const newLike = await this.likeEntity.save(like);

    return newLike;
  }

  async cancleLike(like: Like) {
    return await this.likeEntity.delete(like);
  }

  async checkLike(userId: number, diaryId: number) {
    return await this.likeEntity.findOneBy({ userId, diaryId });
  }
}
