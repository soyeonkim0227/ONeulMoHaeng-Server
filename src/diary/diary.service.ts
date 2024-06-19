import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateDiaryDto } from './dto/createDiary.dto';
import { GetAllDiaryDto } from './dto/getAllDiary.dto';
import { UpdateDiaryDto } from './dto/updateDiary.dto';
import { DiaryRepository } from 'src/shared/repositories/diary.repository';
import { DiaryImageRepository } from 'src/shared/repositories/diaryImage.repository';

@Injectable()
export class DiaryService {
  constructor(
    private readonly diaryRepository: DiaryRepository,
    private readonly diaryImageRepository: DiaryImageRepository,
    private readonly authService: AuthService,
  ) {}

  async createDiary(accessToken: string, diaryDto: CreateDiaryDto) {
    const { userId } = await this.authService.validateAccess(accessToken);
    const { imageUrl } = diaryDto;

    const newDiary = await this.diaryRepository.createDiary(userId, diaryDto);

    if (imageUrl) {
      for (let image of imageUrl) {
        await this.diaryImageRepository.createDiaryImage(newDiary.id, image);
      }
    }
  }

  async updateDiary(
    accessToken: string,
    diaryId: number,
    diaryDto: UpdateDiaryDto,
  ) {
    const { imageUrl } = diaryDto;
    const { userId } = await this.authService.validateAccess(accessToken);

    const existDiary = await this.diaryRepository.findOneDiaryById(diaryId);
    if (!existDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (userId !== existDiary.userId)
      throw new ForbiddenException('다이어리 작성자가 아님');

    await this.diaryRepository.updateDiary(diaryId, diaryDto);

    if (imageUrl) {
      await this.diaryImageRepository.deleteDiary(diaryId);

      for (let image of imageUrl) {
        await this.diaryImageRepository.createDiaryImage(diaryId, image);
      }
    }
  }

  async deleteDiary(accessToken: string, diaryId: number) {
    const { userId } = await this.authService.validateAccess(accessToken);

    const existDiary = await this.diaryRepository.findOneDiaryById(diaryId);
    if (!existDiary) throw new NotFoundException('존재하지 않는 다이어리');
    if (userId !== existDiary.userId)
      throw new ForbiddenException('다이어리 작성자가 아님');

    return await this.diaryRepository.deleteDiary(diaryId);
  }

  async getOneDiary(accessToken: string, diaryId: number): Promise<object> {
    const { userId } = await this.authService.validateAccess(accessToken);

    const diary = await this.diaryRepository.findOneDiaryById(diaryId);
    if (!diary) throw new NotFoundException('존재하지 않는 다이어리');

    const isMine = userId === diary.userId ? true : false;
    const images = await this.diaryImageRepository.getImages(diaryId);

    if (!diary.isShown && !isMine)
      throw new ForbiddenException('비공개 다이어리는 조회 불가');

    return {
      isMine,
      diary,
      images,
    };
  }

  async getAllDiary(
    accessToken: string,
    dto: GetAllDiaryDto,
  ): Promise<object[]> {
    const { userId } = await this.authService.validateAccess(accessToken);
    const { yearMonth } = dto;

    // 2024-02 형식으로 입력받기
    const regex = /\d{4}-\d{2}/;
    if (!regex.test(yearMonth))
      throw new BadRequestException('잘못된 날짜 형식');

    const diaries = await this.diaryRepository.getAllDiary(userId, dto);
    if (diaries.length === 0) throw new HttpException('No Content', 204);

    return diaries;
  }

  async getDiaryListOfLikes(accessToken: string): Promise<object[]> {
    const { userId } = await this.authService.validateAccess(accessToken);

    const diaries = await this.diaryRepository.getDiaryListOfLikes(userId);
    if (diaries.length === 0) throw new HttpException('No Content', 204);

    return diaries;
  }
}
