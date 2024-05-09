import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowType } from 'src/common/enum';
import { CreateDiaryDto } from 'src/diary/dto/createDiary.dto';
import { GetAllDiaryDto } from 'src/diary/dto/getAllDiary.dto';
import { UpdateDiaryDto } from 'src/diary/dto/updateDiary.dto';
import { Repository } from 'typeorm';
import { Diary } from '../entities/diary.entity';
import { DiaryImage } from '../entities/diaryImage.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class DiaryRepository {
  constructor(
    @InjectRepository(Diary) private readonly diaryEntity: Repository<Diary>,
  ) {}

  async createDiary(userId: number, diaryDto: CreateDiaryDto) {
    const { title, content, isShown, date } = diaryDto;
    const diary = new Diary();

    diary.userId = userId;
    diary.title = title;
    diary.content = content;
    diary.isShown = isShown;
    diary.date = date;
    diary.createdAt = new Date();

    const newDiary = await this.diaryEntity.save(diary);

    return newDiary;
  }

  async findOneDiaryById(diaryId: number): Promise<Diary> {
    const thisDiary = await this.diaryEntity.findOneBy({ id: diaryId });

    return thisDiary;
  }

  async getAllDiary(userId: number, dto: GetAllDiaryDto): Promise<object> {
    const { yearMonth, sort, isShown, isMine } = dto;

    const diaries = await this.diaryEntity
      .createQueryBuilder('qb')
      .innerJoin('qb.user', 'user', 'user.id = qb.userId')
      .leftJoin('qb.likes', 'like')
      .leftJoin('qb.diaryImage', 'image')
      .select([
        'qb.id AS diaryId',
        'qb.title AS title',
        'qb.date AS date',
        'qb.isShown AS isShown',
        'count(like.diaryId) AS likeCount',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('image.imageUrl')
          .from(DiaryImage, 'image')
          .where('image.diaryId = qb.id')
          .limit(1);
      })
      .addSelect((subQuery) => {
        return subQuery
          .select('user.nickname AS nickname')
          .from(User, 'user')
          .where('user.id = qb.userId');
      })
      .where('qb.date LIKE :date', { date: `${yearMonth}%` })
      .orderBy('qb.date', `${sort}`)
      .groupBy('qb.id');

    // feed일 때는 isShown이 true인 것만, my일 때는 isShown 필터링 모두 가능
    if (isMine) {
      diaries.andWhere('qb.userId = :userId', { userId });

      if (isShown !== ShowType.ALL) {
        console.log({ isShown });
        diaries.andWhere('qb.isShown = :isShown', { isShown });
      }
    } else {
      diaries.andWhere('qb.isShown = :isShown', { isShown: true });
    }

    return diaries.getRawMany();
  }

  async updateDiary(diaryId: number, diaryDto: UpdateDiaryDto) {
    const { title, content, isShown, date } = diaryDto;

    await this.diaryEntity.update(diaryId, {
      title,
      content,
      isShown,
      date,
    });
  }

  async deleteDiary(diaryId: number) {
    return await this.diaryEntity.delete(diaryId);
  }
}
