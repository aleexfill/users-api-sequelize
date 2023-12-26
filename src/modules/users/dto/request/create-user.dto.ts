import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message: 'Password must contain at least one uppercase letter',
  })
  password: string;

  roleId: string;
}
