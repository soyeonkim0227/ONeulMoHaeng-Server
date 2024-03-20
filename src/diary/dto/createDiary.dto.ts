import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  isShown: boolean;

  @IsArray()
  @IsOptional()
  imageUrl?: string[];
}
