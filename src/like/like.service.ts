import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LikeRepository } from 'src/shared/repositories/like.repository';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly authService: AuthService,
  ) {}

  async addOrCancleLike(accessToken: string, diaryId: number) {
    const { userId } = await this.authService.validateAccess(accessToken);

    const like = await this.likeRepository.checkLike(userId, diaryId);

    if (!like) {
      await this.likeRepository.addLike(userId, diaryId);
      return true;
    } else if (like) {
      await this.likeRepository.cancleLike(like);
      return false;
    }
  }
}
