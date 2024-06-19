import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DiaryRepository } from 'src/shared/repositories/diary.repository';
import { LikeRepository } from 'src/shared/repositories/like.repository';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly diaryRepository: DiaryRepository,
    private readonly authService: AuthService,
  ) {}

  async addOrCancleLike(accessToken: string, diaryId: number) {
    const { userId } = await this.authService.validateAccess(accessToken);

    const thisDiary = await this.diaryRepository.findOneDiaryById(diaryId);
    if (!thisDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (!thisDiary.isShown && thisDiary.userId !== userId)
      throw new ForbiddenException('비공개 다이어리는 좋아요 추가/삭제 불가');

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
