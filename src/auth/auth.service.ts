import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { JwtService } from '@nestjs/jwt';
import { configDotenv } from 'dotenv';
import { LoginRequestDto } from 'src/user/dto/login.dto';
import { SignupRequestDto } from 'src/user/dto/signup.dto';
import { UserPayloadDto } from 'src/user/dto/userPayload.dto';
import { UserRepository } from 'src/shared/repositories/user.repository';
import * as bcrypt from 'bcrypt';

configDotenv();

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRedis() private readonly redis: Redis,
    private jwt: JwtService,
  ) {
    this.tranporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private tranporter: Mail;

  async sendMail(email: string) {
    const generateRandom = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const number = String(generateRandom(1, 999999)).padStart(6, '0');

    // 유효시간 5분
    await this.redis.set(email, number, 'EX', 60 * 5);

    const emailOptions: EmailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: '[오늘모행] 인증 관련 메일',
      html: `인증번호 ${number}`,
    };

    await this.tranporter.sendMail(emailOptions);

    console.log({ number });
    return number;
  }

  // TODO: 엥 redis에 저장되지 않은 이메일이라면?? 에러처리 해야됨.
  private async verifyCode(email: string, code: string) {
    const getCode = await this.redis.get(email);
    if (Number(code) !== Number(getCode))
      throw new ConflictException('인증번호가 유효하지 않거나 일치하지 않음');

    return true;
  }

  async signup(signupDto: SignupRequestDto) {
    const { email, code, nickname, password } = signupDto;

    const existEmail = await this.userRepository.findUserByEmail(email);
    if (existEmail) throw new ConflictException('이미 존재하는 이메일');

    const existNickname = await this.userRepository.existsNickname(nickname);
    if (existNickname) throw new ConflictException('이미 존재하는 닉네임');

    if (!(await this.verifyCode(email, code)))
      throw new ConflictException('인증번호 불일치 또는 만료');

    signupDto.password = await bcrypt.hash(password, 10);

    return await this.userRepository.createUser(signupDto);
  }

  async login(loginDto: LoginRequestDto): Promise<object> {
    const { email, password } = loginDto;

    const findUser = await this.userRepository.findUserByEmail(email);
    if (!findUser) throw new NotFoundException('존재하지 않는 이메일');

    const matchedPw = await bcrypt.compare(password, findUser.password);
    if (!matchedPw) throw new ConflictException('비밀번호 불일치');

    const payload = {
      userId: findUser.id,
      email,
    };

    const access = await this.getAccessToken(payload);
    const refresh = await this.getRefreshToken(payload);

    await this.redis.set(`${email}-RefreshToken`, refresh);

    return {
      access,
      refresh,
    };
  }

  private async getAccessToken(userDto: UserPayloadDto): Promise<string> {
    const accessToken = await this.jwt.sign(userDto, {
      secret: process.env.JWT_SECRET_ACCESS,
    });

    return accessToken;
  }

  private async getRefreshToken(userDto: UserPayloadDto): Promise<string> {
    const refreshToken = await this.jwt.sign(userDto, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '1w',
    });

    return refreshToken;
  }

  async validateAccess(accessToken: string): Promise<UserPayloadDto> {
    const accesstoken = accessToken.split(' ')[1];

    const access = await this.jwt.verify(accesstoken, {
      secret: process.env.JWT_SECRET_ACCESS,
    });

    if (!access) throw new UnauthorizedException('리프레시 토큰 검증 필요');

    return access;
  }

  async validateRefresh(refreshToken: string): Promise<object> {
    const refreshtoken = refreshToken.split(' ')[1];

    const refresh = await this.jwt.verify(refreshtoken, {
      secret: process.env.JWT_SECRET_REFRESH,
    });

    if (!refresh) throw new UnauthorizedException('재로그인 필요');

    const accessToken = await this.getAccessToken({
      userId: refresh.id,
      email: refresh.email,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
