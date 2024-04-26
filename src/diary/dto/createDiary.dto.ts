import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isShown: boolean;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @IsOptional()
  imageUrl?: string[];
}
