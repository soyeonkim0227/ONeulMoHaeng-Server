import {
  Body,
  Controller,
  Delete,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/addComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:diaryId')
  async addComment(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
    @Body() dto: AddCommentDto,
  ) {
    await this.commentService.addComment(accessToken, diaryId, dto);

    return {
      statusCode: 201,
      statusMsg: 'Created',
    };
  }

  @Put('/:commentId')
  async updateComment(
    @Headers('Authorization') accessToken: string,
    @Param('commentId') commentId: number,
    @Body() dto: UpdateCommentDto
  ) {
    await this.commentService.updateComment(accessToken, commentId, dto);

    return {
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }

  @Delete('/:commentId')
  async deleteComment(
    @Headers('Authorization') accessToken: string,
    @Param('commentId') commentId: number,
  ) {
    await this.commentService.deleteComment(accessToken, commentId);

    return {
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }
}
