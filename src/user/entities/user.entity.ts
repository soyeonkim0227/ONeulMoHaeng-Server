import { Comment } from 'src/comment/entities/comment.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { Like } from 'src/like/entities/like.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  shortInform: string;

  @Column({ nullable: true })
  memo: string;

  @OneToMany(() => Diary, (diary) => diary.user)
  diary: Diary;

  @OneToMany(() => Like, (likes) => likes.user)
  likes: Like;

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment;
}
