import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like) private readonly likeEntity: Repository<Like>,
  ) {}
}
