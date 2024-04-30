import { Body, Controller, Get, Headers, Param, Patch } from '@nestjs/common';
import { UpdateMyInfo } from './dto/updateMyInfo.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('my')
  async updateMyInfo(
    @Headers('Authorization') accessToken: string,
    @Body() dto: UpdateMyInfo,
  ) {
    await this.userService.updateMyInfo(accessToken, dto);

    return {
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }

  @Get('/:userId')
  async getUserInfo(
    @Headers('Authorization') accessToken: string,
    @Param('userId') userId: number,
  ) {
    const data = await this.userService.getUserInfo(accessToken, userId);

    return {
      data,
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }
}
