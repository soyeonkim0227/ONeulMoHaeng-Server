import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/addComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { Response } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:diaryId')
  async addComment(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
    @Body() dto: AddCommentDto,
    @Res() res: Response,
  ) {
    await this.commentService.addComment(accessToken, diaryId, dto);

    return res.status(201).json('Created').send();
  }

  @Get('/:diaryId')
  async getAllCommentsByDiaryId(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
    @Res() res: Response,
  ): Promise<object> {
    const data = await this.commentService.getAllCommentsByDiaryId(
      accessToken,
      diaryId,
    );

    return res.status(200).json(data).send();
  }

  @Put('/:commentId')
  async updateComment(
    @Headers('Authorization') accessToken: string,
    @Param('commentId') commentId: number,
    @Body() dto: UpdateCommentDto,
    @Res() res: Response,
  ) {
    await this.commentService.updateComment(accessToken, commentId, dto);

    return res.status(200).json('Ok').send();
  }

  @Delete('/:commentId')
  async deleteComment(
    @Headers('Authorization') accessToken: string,
    @Param('commentId') commentId: number,
    @Res() res: Response,
  ) {
    await this.commentService.deleteComment(accessToken, commentId);

    return res.status(200).json('Ok').send();
  }
}
