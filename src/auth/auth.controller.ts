import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { LoginRequestDto } from 'src/user/dto/login.dto';
import { SignupRequestDto } from 'src/user/dto/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) {}

  @Post('mail')
  async sendMail(@Body('email') email: string) {
    await this.authService.sendMail(email);

    return {
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupRequestDto) {
    await this.authService.signup(signupDto);

    return {
      statusCode: 201,
      statusMsg: 'Created',
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<object> {
    const data = await this.authService.login(loginDto);

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
    const data = await this.authService.validateRefresh(refreshToken);

    return {
      data,
      statusCode: 200,
      statusMsg: 'Ok',
    };
  }
}
