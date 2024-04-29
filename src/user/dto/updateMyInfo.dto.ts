import { IsOptional, IsString } from 'class-validator';

export class UpdateMyInfo {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  shortInform?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;
}
