import { Diary } from 'src/diary/entities/diary.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('tbl_like')
export class Like {
  @PrimaryColumn()
  diaryId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Diary, (diary) => diary.likes, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'diaryId' })
  diary: Diary;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
