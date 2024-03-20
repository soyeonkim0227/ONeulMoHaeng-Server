import { IsString } from "class-validator";

export class UserPayloadDto {
  @IsString()
  userId: number;
  
  @IsString()
  email: string;
}