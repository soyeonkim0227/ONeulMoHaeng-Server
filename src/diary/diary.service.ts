import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateDiaryDto } from './dto/createDiary.dto';
import { UpdateDiaryDto } from './dto/updateDiary.dto';
import { Diary } from './entities/diary.entity';
import { DiaryImage } from './entities/diaryImage.entity';

@Injectable()
export class DiaryService {
  constructor(
    private userService: UserService,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Diary) private diaryEntity: Repository<Diary>,
    @InjectRepository(DiaryImage)
    private diaryImageEntity: Repository<DiaryImage>,
  ) {}

  async createDiary(accessToken: string, diaryDto: CreateDiaryDto) {
    const { title, content, isShown, date, imageUrl } = diaryDto;
    const { userId } = await this.userService.validateAccess(accessToken);

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
    const { userId } = await this.userService.validateAccess(accessToken);

    const existDiary = await this.diaryEntity.findOneBy({ id: diaryId });
    if (!existDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (userId !== existDiary.userId)
      throw new ForbiddenException('다이어리 작성자가 아님');

    await this.diaryEntity.update(diaryId, {
      title,
      content,
      isShown,
      date,
    });

    if (imageUrl) {
      await this.diaryImageEntity.delete(diaryId);

      imageUrl.map(async (x) => {
        await this.diaryImageEntity.save({
          diaryId,
          imageUrl: x,
        });
      });
    }
  }

  async deleteDiary(accessToken: string, diaryId: number) {
    const { userId } = await this.userService.validateAccess(accessToken);

    const existDiary = await this.diaryEntity.findOneBy({ id: diaryId });
    if (!existDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (userId !== existDiary.userId)
      throw new ForbiddenException('다이어리 작성자가 아님');

    return await this.diaryEntity.delete(existDiary);
  }

  async getOneMyDiary(accessToken: string, diaryId: number): Promise<object> {
    const { userId } = await this.userService.validateAccess(accessToken);

    const existDiary = await this.diaryEntity.findOneBy({ id: diaryId });
    if (!existDiary) throw new NotFoundException('존재하지 않는 다이어리');

    const isMine = userId === existDiary.userId ? true : false;
    const existImage = await this.diaryImageEntity.findBy({ diaryId });

    return {
      isMine,
      existDiary,
      existImage,
    };
  }

  async getAllMyDiary(accessToken: string): Promise<object> {
    const { userId } = await this.userService.validateAccess(accessToken);

    const myName = await (
      await this.userEntity.findOneBy({ id: userId })
    ).nickname;

    // TODO: 이미지
    const readMy = await this.diaryEntity
      .createQueryBuilder('qb')
      .innerJoin('qb.user', 'user', 'user.id = qb.userId')
      .leftJoin('qb.likes', 'like')
      .select([
        'qb.id AS diaryId',
        'qb.title AS title',
        'qb.date AS date',
        'qb.isShown AS isShown',
        'count(like.diaryId) AS likeCount',
      ])
      .where('qb.userId = :userId', { userId })
      .groupBy('qb.id')
      .getRawMany();

    return {
      myName,
      readMy,
    };
  }
}
