import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupRequestDto } from 'src/user/dto/signup.dto';
import { UpdateMyInfo } from 'src/user/dto/updateMyInfo.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userEntity: Repository<User>,
  ) {}

  async createUser(signupDto: SignupRequestDto) {
    const { email, nickname, password, profileImageUrl, shortInform } =
      signupDto;

    const user = new User();

    user.email = email;
    user.nickname = nickname;
    user.password = password;
    user.profileImageUrl = profileImageUrl;
    user.shortInform = shortInform;

    const newUser = await this.userEntity.save(user);

    return newUser;
  }

  async existsUser(userId: number): Promise<boolean> {
    const existsUser = await this.userEntity.existsBy({ id: userId });

    return existsUser;
  }

  async existsNickname(nickname: string): Promise<boolean> {
    const existsNickname = await this.userEntity.existsBy({ nickname });

    return existsNickname;
  }

  async findUserByEmail(email: string): Promise<User> {
    const existsEmail = await this.userEntity.findOneBy({ email });

    return existsEmail;
  }

  async getOneUser(userId: number): Promise<User> {
    const user = await this.userEntity
      .createQueryBuilder('qb')
      .select(['id', 'nickname', 'email', 'profileImageUrl', 'shortInform'])
      .where('qb.id = :userId', { userId })
      .getOne();

    return user;
  }

  async updateMyInfo(userId, dto: UpdateMyInfo) {
    const updateMine = await this.userEntity.update(userId, dto);

    return updateMine;
  }
}
