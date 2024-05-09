import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddCommentDto } from 'src/comment/dto/addComment.dto';
import { UpdateCommentDto } from 'src/comment/dto/updateComment.dto';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentEntity: Repository<Comment>,
  ) {}

  async createComment(diaryId: number, userId: number, dto: AddCommentDto) {
    const { content } = dto;
    const comment = new Comment();

    comment.diaryId = diaryId;
    comment.userId = userId;
    comment.content = content,
    comment.createdAt = new Date();
  }

  async findOneCommentById(commentId: number): Promise<Comment> {
    const thisComment = await this.commentEntity.findOneBy({ id: commentId });

    return thisComment;
  }

  async updateComment(commentId: number, dto: UpdateCommentDto) {
    return await this.commentEntity.update(commentId, dto);
  }

  async deleteComment(commentId: number) {
    return await this.commentEntity.delete(commentId);
  }
}
