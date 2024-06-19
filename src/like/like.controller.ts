import { Controller, Headers, Param, Post, Res } from '@nestjs/common';
import { LikeService } from './like.service';
import { Response } from 'express';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/:diaryId')
  async addOrCancleLike(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
    @Res() res: Response,
  ) {
    const status = await this.likeService.addOrCancleLike(accessToken, diaryId);

    if (status) return res.status(201).json('Like Add Success').send();
    else if (!status) return res.status(200).json('Like Cancle Success').send();
  }
}
