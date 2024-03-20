import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateDiaryDto } from './dto/createDiary.dto';
import { Diary, DiaryDocument } from './schema/diary.schema';
import { DiaryImage, DiaryImageDocument } from './schema/diaryImage.schema';

@Injectable()
export class DiaryService {
  constructor(
    private userService: UserService,
    @InjectModel(Diary.name) private diaryModel: Model<DiaryDocument>,
    @InjectModel(DiaryImage.name) private imageModel: Model<DiaryImageDocument>,
  ) {}

  async createDiary(accessToken: string, diaryDto: CreateDiaryDto) {
    const { title, content, isShown, imageUrl } = diaryDto;
    const { userId } = await this.userService.validateAccess(accessToken);

    const newDiary = await new this.diaryModel({
      userId,
      title,
      content,
      isShown,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }).save();

    if (imageUrl) {
      imageUrl.map(async (x) => {
        await new this.imageModel({
          diaryId: newDiary.id,
          imageUrl: x,
        }).save();
      });
    }
  }
}
