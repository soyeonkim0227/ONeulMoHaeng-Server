import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    @InjectRepository(Diary) private diaryEntity: Repository<Diary>,
    @InjectRepository(DiaryImage) private diaryImageEntity: Repository<DiaryImage>,
  ) {}

  async createDiary(accessToken: string, diaryDto: CreateDiaryDto) {
    const { title, content, isShown, imageUrl } = diaryDto;
    const { userId } = await this.userService.validateAccess(accessToken);

    const newDiary =  await this.diaryEntity.save({
      userId,
      title,
      content,
      isShown,
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
    const { title, content, isShown, imageUrl } = diaryDto;
    const { userId } = await this.userService.validateAccess(accessToken);

    const existDiary = await this.diaryEntity.findOneBy({ id: diaryId });
    if (!existDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (userId !== existDiary.userId) throw new ForbiddenException('다이어리 작성자가 아님');

    await this.diaryEntity.update(diaryId,{
      title,
      content,
      isShown
    });

    if (imageUrl) {
      await this.diaryImageEntity.delete({ diaryId });

      imageUrl.map(async (x) => {
        await this.diaryImageEntity.save({
          diaryId,
          imageUrl: x,
        });
      });
    }
  }
}
