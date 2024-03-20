import { Body, Controller, Headers, Post } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/createDiary.dto';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  async createDiary(
    @Headers('Authorization') accessToken: string,
    @Body() diaryDto: CreateDiaryDto,
  ) {
    await this.diaryService.createDiary(accessToken, diaryDto);

    return {
      statusCode: 201,
      statusMsg: 'Created',
    };
  }
}
