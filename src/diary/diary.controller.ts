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
import { DiarySort, ShowOption } from 'src/common/enum';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/createDiary.dto';
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
  async getOneMyDiary(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
  ): Promise<object> {
    const data = await this.diaryService.getOneMyDiary(accessToken, diaryId);

    return {
      data,
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }

  @Get('my?')
  async getAllMyDiary(
    @Headers('Authorization') accessToken: string,
    @Query('year-month') yearMonth: string,
    @Query('sort') sort: DiarySort,
    @Query('is-shown') isShown: ShowOption,
  ): Promise<object> {
    const data = await this.diaryService.getAllMyDiary(
      accessToken,
      yearMonth,
      sort,
      isShown,
    );

    return {
      data,
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }
}
