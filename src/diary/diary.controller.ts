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
  Res,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/createDiary.dto';
import { GetAllDiaryDto } from './dto/getAllDiary.dto';
import { UpdateDiaryDto } from './dto/updateDiary.dto';
import { Response } from 'express';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  async createDiary(
    @Headers('Authorization') accessToken: string,
    @Body() diaryDto: CreateDiaryDto,
    @Res() res: Response,
  ) {
    await this.diaryService.createDiary(accessToken, diaryDto);

    return res.status(201).json('Created').send();
  }

  @Patch('/:diaryId')
  async updateDiary(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
    @Body() diaryDto: UpdateDiaryDto,
    @Res() res: Response,
  ) {
    await this.diaryService.updateDiary(accessToken, diaryId, diaryDto);

    return res.status(200).json('Ok').send();
  }

  @Delete('/:diaryId')
  async deleteDiary(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
    @Res() res: Response,
  ) {
    await this.diaryService.deleteDiary(accessToken, diaryId);

    return res.status(200).json('Ok').send();
  }

  @Get('/my/:diaryId')
  async getOneDiary(
    @Headers('Authorization') accessToken: string,
    @Param('diaryId') diaryId: number,
    @Res() res: Response,
  ): Promise<object> {
    const data = await this.diaryService.getOneDiary(accessToken, diaryId);

    return res.status(200).json(data).send();
  }

  @Get('?')
  async getAllDiary(
    @Headers('Authorization') accessToken: string,
    @Query() dto: GetAllDiaryDto,
    @Res() res: Response,
  ): Promise<object> {
    const data = await this.diaryService.getAllDiary(accessToken, dto);

    return res.status(200).json(data).send();
  }

  @Get('/likes')
  async getDiaryListOfLikes(
    @Headers('Authorization') accessToken: string,
    @Res() res: Response,
  ): Promise<object> {
    const data = await this.diaryService.getDiaryListOfLikes(accessToken);

    return res.status(200).json(data).send();
  }
}
