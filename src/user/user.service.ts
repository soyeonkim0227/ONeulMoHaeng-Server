import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UpdateMyInfo } from './dto/updateMyInfo.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userEntity: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async updateMyInfo(accessToken: string, dto: UpdateMyInfo) {
    const { userId } = await this.authService.validateAccess(accessToken);

    // 변경하려는 닉네임이 중복되는지 확인
    const existNickname = await this.userEntity.findOne({
      where: { nickname: dto.nickname },
    });
    if (existNickname) throw new ConflictException('이미 존재하는 닉네임');

    return await this.userEntity.update(userId, dto);
  }

  async getUserInfo(accessToken: string, userId: number) {
    await this.authService.validateAccess(accessToken);

    if (!(await this.userEntity.existsBy({ id: userId })))
      throw new NotFoundException('존재하지 않는 유저');

    const thisUser = await this.userEntity.findOne({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        email: true,
        profileImageUrl: true,
        shortInform: true,
      },
    });

    return thisUser;
  }
}
