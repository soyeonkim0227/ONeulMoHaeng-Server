import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './diary.entity';

@Entity('tbl_diary_image')
export class DiaryImage {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  diaryId: number;

  @Column()
  imageUrl: string;

  @ManyToOne(
    () => Diary,
    diary => diary.diaryImage
  )
  @JoinColumn({ name: 'diaryId' })
  diary: Diary;
}
