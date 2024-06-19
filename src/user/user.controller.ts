import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { UpdateMyInfo } from './dto/updateMyInfo.dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('my')
  async updateMyInfo(
    @Headers('Authorization') accessToken: string,
    @Body() dto: UpdateMyInfo,
    @Res() res: Response,
  ) {
    await this.userService.updateMyInfo(accessToken, dto);

    return res.status(200).json('Ok').send();
  }

  @Get('/:userId')
  async getUserInfo(
    @Headers('Authorization') accessToken: string,
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    const data = await this.userService.getUserInfo(accessToken, userId);

    return res.status(200).json(data).send();
  }
}
