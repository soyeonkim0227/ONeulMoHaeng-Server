import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDiaryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isShown?: boolean;

  @IsString()
  @IsOptional()
  date: string;

  @IsArray()
  @IsOptional()
  imageUrl?: string[];
}
