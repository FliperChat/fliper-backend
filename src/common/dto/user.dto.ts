import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class SignInDTO {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 25)
  password: string;
}

export class SignUpDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsDateString()
  birthDay: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 25)
  password: string;
}

export class M_ProfileDTO {
  @Expose()
  _id: string;

  @Expose()
  login: string;

  @Expose()
  description: string;

  @Expose()
  verified: boolean;
}
