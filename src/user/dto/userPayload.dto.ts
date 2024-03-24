import { IsNumber, IsString } from 'class-validator';

export class UserPayloadDto {
  @IsNumber()
  userId: number;

  @IsString()
  email: string;
}