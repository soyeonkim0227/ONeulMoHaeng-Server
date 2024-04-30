import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/addComment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:diaryId')
  async addComment(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
    @Body() dto: AddCommentDto
  ) {
    await this.commentService.addComment(accessToken, diaryId, dto);

    return {
      statusCode: 201,
      statusMsg: 'Created',
    };
  }
}
