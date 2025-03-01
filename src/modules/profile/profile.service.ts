import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SignInDTO, SignUpDTO } from 'src/common/dto/user.dto';
import { Users } from 'src/common/entity/profile/users.schema';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import * as moment from 'moment';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async login(auth: SignInDTO): Promise<string> {
    const { login, password } = auth;

    const user = isEmail(login)
      ? await this.usersModel.findOne({ email: login })
      : await this.usersModel.findOne({ login });

    if (!user) {
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
        expiresIn: '30d',
      },
    );

    return token;
  }

  async register(
    reg: SignUpDTO,
  ): Promise<{ token: string; _id: Types.ObjectId; email: string }> {
    const user = await this.usersModel.findOne({
      $or: [{ email: reg.email }, { login: reg.login }],
    });

    if (user) {
      throw new HttpException(
        'E-mail or login is already taken',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const birthDate = moment(reg.birthDay, 'YYYY-MM-DD');
    const age = moment().diff(birthDate, 'years');

    if (age < 18) {
      throw new HttpException(
        'You must be at least 18 years old to register',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(reg.password, 3);

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
  }

  async updateUserImg(id: Types.ObjectId, fileName: string) {
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
}
