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
    comment.content = content;
    comment.createdAt = new Date();

    const newComment = await this.commentEntity.save(comment);

    return newComment;
  }

  async getAllComments(diaryId: number): Promise<object> {
    return await this.commentEntity
      .createQueryBuilder('qb')
      .select(['qb.userId AS userId', 'qb.content AS content', 'qb.createdAt AS createdAt'])
      .where('qb.diaryId = :diaryId', { diaryId })
      .orderBy('qb.id', 'DESC')
      .getRawMany();
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
