import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.dto';
import { SignupRequestDto } from './dto/signup.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('mail')
  async sendMail(@Body('email') email: string) {
    await this.userService.sendMail(email);

    return {
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupRequestDto) {
    await this.userService.signup(signupDto);

    return {
      statusCode: 201,
      statusMsg: 'Created',
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<object> {
    const data = await this.userService.login(loginDto);

    return {
      data,
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }

  @Get('token')
  async validateRefresh(
    @Headers('Authorization') refreshToken: string,
  ): Promise<object> {
    const data = await this.userService.validateRefresh(refreshToken);

    return {
      data,
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }
}
