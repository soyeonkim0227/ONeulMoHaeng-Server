import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { LoginRequestDto } from 'src/user/dto/login.dto';
import { SignupRequestDto } from 'src/user/dto/signup.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('mail')
  async sendMail(@Body('email') email: string, @Res() res: Response) {
    await this.authService.sendMail(email);

    return res.status(200).json('Ok').send();
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupRequestDto, @Res() res: Response) {
    await this.authService.signup(signupDto);

    return res.status(201).json('Created').send();
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res() res: Response,
  ): Promise<object> {
    const data = await this.authService.login(loginDto);

    return res.status(200).json(data).send();
  }

  @Get('token')
  async validateRefresh(
    @Headers('Authorization') refreshToken: string,
    @Res() res: Response,
  ): Promise<object> {
    const data = await this.authService.validateRefresh(refreshToken);

    return res.status(200).json(data).send();
  }
}
