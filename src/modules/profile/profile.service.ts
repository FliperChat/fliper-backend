import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ConfForgetPassDTO,
  M_ProfileDTO,
  SignInDTO,
  SignUpDTO,
} from 'src/common/dto/user.dto';
import { User } from 'src/common/entity/profile/user.schema';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { Request } from 'express';
import { ITokenData } from 'src/common/types';
import { plainToClass } from 'class-transformer';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private readonly jwtService: JwtService,
    private cacheManager: Cache,
  ) {}

  /**
   * Приватный метод для вычисления хеширования пароля.
   *
   * @public
   * @param {SignInDTO} auth - Пароль для хеширования.
   * @returns {Promise<string>} - Зашифрованный пароль.
   */
  async login(auth: SignInDTO): Promise<string> {
    const { login, password } = auth;

    const user = await this.usersModel
      .findOne({
        $or: [{ email: login }, { login: login }],
      })
      .exec();

    if (!user || !user.verified) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const token = await this.jwtService.signAsync(
      { email: user.email, _id: user._id },
      {
        secret: process.env.JWT_SECRET_AUTH,
        expiresIn: '1d',
      },
    );

    return token;
  }

  async register(
    reg: SignUpDTO,
  ): Promise<{ token: string; _id: Types.UUID; email: string }> {
    try {
      const user = await this.usersModel
        .findOne({
          $or: [{ email: reg.email }, { login: reg.login }],
        })
        .exec();

      if (user) {
        if (!user.verified) await this.deleteProfile(user._id);
        else {
          const field = user.email === reg.email ? 'E-mail' : 'Login';

          throw new HttpException(
            { message: `${field} is already taken`, field },
            HttpStatus.CONFLICT,
          );
        }
      }

      const birthDate = moment(reg.birthDay, 'YYYY-MM-DD');
      const age = moment().diff(birthDate, 'years');

      if (age < 18) {
        throw new HttpException(
          'You must be at least 18 years old to register',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const hashPassword = await bcrypt.hash(reg.password, 10);

      const newUser = await this.usersModel.create({
        ...reg,
        password: hashPassword,
        birthDay: birthDate.toDate(),
      });

      const token = await this.jwtService.signAsync(
        { _id: newUser._id },
        {
          secret: process.env.JWT_SECRET_REG,
          expiresIn: '1d',
        },
      );

      return { token, _id: newUser._id, email: newUser.email };
    } catch (error) {
      throw new HttpException(
        'Error during user registration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmRegistration(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync<ITokenData>(token, {
        secret: process.env.JWT_SECRET_REG,
      });

      const user = await this.usersModel
        .findByIdAndUpdate(payload._id, {
          verified: true,
        })
        .exec();

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user.email;
    } catch (error) {
      throw new HttpException(
        'Error during user confirmation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgetPassword(email: string): Promise<string> {
    const user = await this.usersModel.findOne({ email }).exec();

    if (!user || !user.verified) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const token = await this.jwtService.signAsync(
      { _id: user._id },
      {
        secret: process.env.JWT_SECRET_FORGET,
        expiresIn: '1d',
      },
    );

    return token;
  }

  async confirmForgetPassword(dto: ConfForgetPassDTO): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(dto.token, {
        secret: process.env.JWT_SECRET_FORGET,
      });

      const hashPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.usersModel
        .findByIdAndUpdate(payload._id, { password: hashPassword })
        .exec();

      if (!user || !user.verified) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user.email;
    } catch (error) {
      throw new HttpException('Token invalid', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async deleteProfile(id: Types.UUID): Promise<boolean> {
    try {
      const res = await this.usersModel.findByIdAndDelete(id);
      this.deleteImage(res as User);
      res?._id;
      return true;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserImg(id: Types.UUID, fileName: string) {
    const user = await this.usersModel.findOne({
      _id: id,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.image = fileName;

    await user.save();
  }

  async saveImage(file: Express.Multer.File, userId: string): Promise<string> {
    const newFileName = `${uuidv4()}.jpeg`;
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'resources',
      'avatars',
      userId,
    );

    await fs.promises.mkdir(filePath, { recursive: true });

    await sharp(file.buffer)
      .jpeg({ quality: 90 })
      .toFile(path.join(filePath, newFileName), (err, info) => {
        if (err) {
          throw new HttpException(
            'Error converting the image.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });

    return newFileName;
  }

  async deleteImage(user: User) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'resources',
      'avatars',
      user.image,
    );

    if (!fs.existsSync(filePath)) return;

    await fs.promises.rm(filePath);
  }

  async profile(req: Request) {
    const tokenData = req.tokenData as ITokenData;

    const cacheKey = `user_profile_${tokenData._id}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.usersModel.findOne({ _id: tokenData._id }).exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.set(cacheKey, user, 300);

    return plainToClass(M_ProfileDTO, user);
  }
}
