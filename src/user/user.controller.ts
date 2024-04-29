import { Body, Controller, Get, Headers, Patch, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.dto';
import { SignupRequestDto } from './dto/signup.dto';
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
}
