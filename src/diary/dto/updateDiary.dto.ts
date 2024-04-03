import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

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

  @IsArray()
  @IsOptional()
  imageUrl?: string[];
}