import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Diary } from 'src/diary/entities/diary.entity';
import { Repository } from 'typeorm';
import { AddCommentDto } from './dto/addComment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Diary) private diaryEntity: Repository<Diary>,
    @InjectRepository(Comment) private commentEntity: Repository<Comment>,
  ) {}

  async addComment(accessToken: string, diaryId: number, dto: AddCommentDto) {
    const { userId } = await this.authService.validateAccess(accessToken);
    const { content } = dto;

    const thisDiary = await this.diaryEntity.findOneBy({ id: diaryId });
    if (!thisDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (!thisDiary.isShown)
      throw new ForbiddenException('비공개 다이어리는 댓글 작성 불가');

    return await this.commentEntity.save({
      diaryId,
      userId,
      content,
      createdAt: new Date(),
    });
  }

  async deleteComment(accessToken: string, commentId: number) {
    const { userId } = await this.authService.validateAccess(accessToken);

    const thisComment = await this.commentEntity.findOneBy({ id: commentId });
    if (!thisComment) throw new NotFoundException('존재하지 않는 댓글');
    if (thisComment.userId !== userId)
      throw new ForbiddenException('댓글 작성자가 아님');

    return await this.commentEntity.delete(thisComment);
  }
}
