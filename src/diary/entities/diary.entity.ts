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

  // TODO: 게시글 생성 날짜를 저장하는게 아니라 사용자가 지정한 날짜를 저장해야함.
  @Column()
  date: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.diary, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Like, (like) => like.diary)
  likes: Like;

  @OneToMany(() => Comment, (comment) => comment.diary)
  comment: Comment;

  @OneToMany(() => DiaryImage, (diaryImage) => diaryImage.diary)
  diaryImage: DiaryImage;
}
