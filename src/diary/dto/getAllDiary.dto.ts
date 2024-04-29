import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ShowType, SortType } from 'src/common/enum';

export class GetAllDiaryDto {
  @IsString()
  @IsNotEmpty()
  yearMonth: string;

  @IsEnum(SortType)
  @IsNotEmpty()
  sort: SortType;

  @IsEnum(ShowType)
  @Transform((value) => {
    if (value.value === '1') return 1;
    else if (value.value === '0') return 0;
    else return value.value;
  })
  @IsNotEmpty()
  isShown: ShowType;

  @IsBoolean()
  @Transform((value) => {
    return value.value === 'true' ? true : false;
  })
  @IsNotEmpty()
  isMine: boolean;
}
