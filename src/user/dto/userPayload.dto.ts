import { IsString } from "class-validator";

export class UserPayloadDto {
  @IsString()
  id: number;
  
  @IsString()
  email: string;
}