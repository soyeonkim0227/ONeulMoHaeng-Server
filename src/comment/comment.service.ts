import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AddCommentDto } from './dto/addComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { DiaryRepository } from 'src/shared/repositories/diary.repository';
import { CommentRepository } from 'src/shared/repositories/comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly authService: AuthService,
    private readonly diaryRepository: DiaryRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async addComment(accessToken: string, diaryId: number, dto: AddCommentDto) {
    const { userId } = await this.authService.validateAccess(accessToken);

    const thisDiary = await this.diaryRepository.findOneDiaryById(diaryId);
    if (!thisDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (!thisDiary.isShown && thisDiary.userId !== userId)
      throw new ForbiddenException('비공개 다이어리는 댓글 작성 불가');

    return await this.commentRepository.createComment(diaryId, userId, dto);
  }

  async getAllCommentsByDiaryId(
    accessToken: string,
    diaryId: number,
  ): Promise<object> {
    const { userId } = await this.authService.validateAccess(accessToken);

    const thisDiary = await this.diaryRepository.findOneDiaryById(diaryId);

    if (!thisDiary) throw new NotFoundException('존재하지 않는 다이어리');

    if (!thisDiary.isShown && thisDiary.userId !== userId)
      throw new ForbiddenException(
        '비공개 다이어리의 댓글은 작성자만 볼 수 있음',
      );

    const comments = await this.commentRepository.getAllComments(diaryId);

    return comments;
  }

  async updateComment(
    accessToken: string,
    commentId: number,
    dto: UpdateCommentDto,
  ) {
    const { userId } = await this.authService.validateAccess(accessToken);

    const thisComment = await this.commentRepository.findOneCommentById(
      commentId,
    );
    if (!thisComment) throw new NotFoundException('존재하지 않는 댓글');
    if (thisComment.userId !== userId)
      throw new ForbiddenException('댓글 작성자가 아님');

    return await this.commentRepository.updateComment(commentId, dto);
  }

  async deleteComment(accessToken: string, commentId: number) {
    const { userId } = await this.authService.validateAccess(accessToken);

    const thisComment = await this.commentRepository.findOneCommentById(
      commentId,
    );
    if (!thisComment) throw new NotFoundException('존재하지 않는 댓글');
    if (thisComment.userId !== userId)
      throw new ForbiddenException('댓글 작성자가 아님');

    return await this.commentRepository.deleteComment(commentId);
  }
}
