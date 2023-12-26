import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/shared/enums';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message: 'Password must contain at least one uppercase letter',
  })
  password?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  aboutMyself?: string;

  @ApiPropertyOptional({ enum: Gender, enumName: 'Gender' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: string;

  @IsOptional()
  @IsBoolean()
  online?: boolean;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  file?: Express.Multer.File;
}
