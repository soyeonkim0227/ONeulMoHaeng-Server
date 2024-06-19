import { Controller, Headers, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/:diaryId')
  async addOrCancleLike(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
  ) {
    const status = await this.likeService.addOrCancleLike(accessToken, diaryId);

    if (status) return { statusCode: 201, statusMsg: 'like add success' };
    else if (!status)
      return { statusCode: 200, statusMsg: 'like cancle success' };
  }
}
