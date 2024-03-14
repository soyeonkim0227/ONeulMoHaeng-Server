import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupRequestDto } from './dto/signup.dto';
import { User, UserDocument } from './schema/user.schema';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import * as bcrypt from 'bcrypt';

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    await this.redis.set(email, number, 'EX', 1000 * 300);

    const emailOptions: EmailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: '[오늘모행] 인증 관련 메일',
      html: `인증번호 ${number}`,
    };

    await this.tranporter.sendMail(emailOptions);

    return number;
  }

  private async verifyCode(email: string, code: string) {
    const getCode = await this.redis.get(email);
    if (Number(code) !== Number(getCode))
      throw new ConflictException('인증번호가 유효하지 않거나 일치하지 않음');

    return true;
  }

  async signup(signupDto: SignupRequestDto) {
    const { email, code, password, nickname } = signupDto;

    const existEmail = await this.userModel.findOne({ email });
    if (existEmail) throw new ConflictException('이미 존재하는 이메일');

    const existNickname = await this.userModel.findOne({ nickname });
    if (existNickname) throw new ConflictException('이미 존재하는 닉네임');

    signupDto.password = await bcrypt.hash(password, 10);

    if (await this.verifyCode(email, code)) {
      const newPerson = await new this.userModel(signupDto);
      return await newPerson.save();
    }
  }
}
