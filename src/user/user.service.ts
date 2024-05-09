import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UpdateMyInfo } from './dto/updateMyInfo.dto';
import { UserRepository } from 'src/shared/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async updateMyInfo(accessToken: string, dto: UpdateMyInfo) {
    const { userId } = await this.authService.validateAccess(accessToken);

    // 변경하려는 닉네임이 중복되는지 확인
    const existNickname = await this.userRepository.existsNickname(
      dto.nickname,
    );
    if (existNickname) throw new ConflictException('이미 존재하는 닉네임');

    return await this.userRepository.updateMyInfo(userId, dto);
  }

  async getUserInfo(accessToken: string, userId: number) {
    await this.authService.validateAccess(accessToken);

    if (!(await this.userRepository.existsUser(userId)))
      throw new NotFoundException('존재하지 않는 유저');

    const thisUser = await this.userRepository.getOneUser(userId);

    return thisUser;
  }
}
