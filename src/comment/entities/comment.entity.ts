import { Diary } from "src/diary/entities/diary.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tbl_comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  diaryId: number;

  @Column()
  userId: number;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(
    () => Diary,
    diary => diary.comment
  )
  @JoinColumn({ name: 'diaryId' })
  diary: Diary;

  @ManyToOne(
    () => User,
    user => user.comment
  )
  @JoinColumn({ name: 'userId' })
  user: User;
}