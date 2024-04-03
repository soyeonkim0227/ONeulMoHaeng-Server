import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaryImage } from './diaryImage.entity';

@Entity('tbl_diary')
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  isShown: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.diary)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Like, (like) => like.diary)
  likes: Like;

  @OneToMany(() => Comment, (comment) => comment.diary)
  comment: Comment;

  @OneToMany(() => DiaryImage, (diaryImage) => diaryImage.diary)
  diaryImage: DiaryImage;
}
