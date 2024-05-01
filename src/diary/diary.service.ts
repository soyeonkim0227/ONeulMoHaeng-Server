import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ShowType } from 'src/common/enum';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateDiaryDto } from './dto/createDiary.dto';
import { GetAllDiaryDto } from './dto/getAllDiary.dto';
import { UpdateDiaryDto } from './dto/updateDiary.dto';
import { Diary } from './entities/diary.entity';
import { DiaryImage } from './entities/diaryImage.entity';

@Injectable()
export class DiaryService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Diary) private diaryEntity: Repository<Diary>,
    @InjectRepository(DiaryImage)
    private diaryImageEntity: Repository<DiaryImage>,
  ) {}

  async createDiary(accessToken: string, diaryDto: CreateDiaryDto) {
    const { title, content, isShown, date, imageUrl } = diaryDto;
    const { userId } = await this.authService.validateAccess(accessToken);

    const newDiary = await this.diaryEntity.save({
      userId,
      title,
      content,
      isShown,
      date,
      createdAt: new Date(),
    });

    if (imageUrl) {
      imageUrl.map(async (x) => {
        await this.diaryImageEntity.save({
          diaryId: newDiary.id,
          imageUrl: x,
        });
      });
    }
  }

  async updateDiary(
    accessToken: string,
    diaryId: number,
    diaryDto: UpdateDiaryDto,
  ) {
    const { title, content, isShown, date, imageUrl } = diaryDto;
    const { userId } = await this.authService.validateAccess(accessToken);

    const existDiary = await this.diaryEntity.findOneBy({ id: diaryId });
    if (!existDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (userId !== existDiary.userId)
      throw new ForbiddenException('다이어리 작성자가 아님');

    await this.diaryEntity.update(existDiary, {
      title,
      content,
      isShown,
      date,
    });

    if (imageUrl) {
      await this.diaryImageEntity.delete(existDiary);

      imageUrl.map(async (x) => {
        await this.diaryImageEntity.save({
          diaryId,
          imageUrl: x,
        });
      });
    }
  }

  async deleteDiary(accessToken: string, diaryId: number) {
    const { userId } = await this.authService.validateAccess(accessToken);

    const existDiary = await this.diaryEntity.findOneBy({ id: diaryId });
    if (!existDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (userId !== existDiary.userId)
      throw new ForbiddenException('다이어리 작성자가 아님');

    return await this.diaryEntity.delete(existDiary);
  }

  async getOneDiary(accessToken: string, diaryId: number): Promise<object> {
    const { userId } = await this.authService.validateAccess(accessToken);

    const diary = await this.diaryEntity.findOneBy({ id: diaryId });
    if (!diary) throw new NotFoundException('존재하지 않는 다이어리');

    const isMine = userId === diary.userId ? true : false;
    const images = await this.diaryImageEntity.findBy({ diaryId });

    if (!diary.isShown && !isMine)
      throw new ForbiddenException('비공개 다이어리는 조회 불가');

    return {
      isMine,
      diary,
      images,
    };
  }

  async getAllDiary(accessToken: string, dto: GetAllDiaryDto): Promise<object> {
    const { userId } = await this.authService.validateAccess(accessToken);
    const { yearMonth, sort, isShown, isMine } = dto;

    // 2024-02 형식으로 입력받기
    const regex = /\d{4}-\d{2}/;
    if (!regex.test(yearMonth))
      throw new BadRequestException('잘못된 날짜 형식');

    const readMy = await this.diaryEntity
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
      readMy.andWhere('qb.userId = :userId', { userId });

      if (isShown !== ShowType.ALL) {
        console.log({ isShown });
        readMy.andWhere('qb.isShown = :isShown', { isShown });
      }
    } else {
      readMy.andWhere('qb.isShown = :isShown', { isShown: true });
    }

    return readMy.getRawMany();
  }
}
