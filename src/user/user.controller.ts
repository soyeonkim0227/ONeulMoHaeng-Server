import { Body, Controller, Post } from '@nestjs/common';
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
}
