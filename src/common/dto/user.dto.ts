import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { Article } from '../entity/article/article.schema';
import { Reel } from '../entity/reel/reel.schema';

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

export class ConfForgetPassDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

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

  @Expose()
  countFollowers: number;

  @Expose()
  countFollowing: number;

  @Expose()
  countArticles: number;

  @Expose()
  articles: Article[];

  @Expose()
  reels: Reel[];

  @Expose()
  favorites: (Reel | Article)[];
}
