import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/createDiary.dto';
import { GetAllDiaryDto } from './dto/getAllDiary.dto';
import { UpdateDiaryDto } from './dto/updateDiary.dto';

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

  @Patch('/:diaryId')
  async updateDiary(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
    @Body() diaryDto: UpdateDiaryDto,
  ) {
    await this.diaryService.updateDiary(accessToken, diaryId, diaryDto);

    return {
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }

  @Delete('/:diaryId')
  async deleteDiary(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
  ) {
    await this.diaryService.deleteDiary(accessToken, diaryId);

    return {
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }

  @Get('/my/:diaryId')
  async getOneDiary(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
  ): Promise<object> {
    const data = await this.diaryService.getOneDiary(accessToken, diaryId);

    return {
      data,
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }

  @Get('?')
  async getAllDiary(
    @Headers('Authorization') accessToken: string,
    @Query() dto: GetAllDiaryDto,
  ): Promise<object> {
    const data = await this.diaryService.getAllDiary(accessToken, dto);

    return {
      data,
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }
}
