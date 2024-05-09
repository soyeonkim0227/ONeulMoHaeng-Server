import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryImage } from '../entities/diaryImage.entity';

@Injectable()
export class DiaryImageRepository {
  constructor(
    @InjectRepository(DiaryImage)
    private readonly diaryImageEntity: Repository<DiaryImage>,
  ) {}

  async createDiaryImage(diaryId: number, imageUrl: string) {
    const image = new DiaryImage();

    image.diaryId = diaryId;
    image.imageUrl = imageUrl;

    const newImage = await this.diaryImageEntity.save(image);

    return newImage;
  }

  async getImages(diaryId: number): Promise<DiaryImage[]> {
    const images = await this.diaryImageEntity.findBy({ diaryId });

    return images;
  }

  async deleteDiary(diaryId: number) {
    return await this.diaryImageEntity.delete(diaryId);
  }
}
