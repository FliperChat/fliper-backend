import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/entity/profile/user.schema';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from 'src/common/entity/profile/refreshToken.schema';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  /**
   * Parameters to save to a token.
   *
   * @private
   * @param { [key: string]: any } payload - Параметры для сохранения в токене.
   * @returns {Promise<string>} - Access Token.
   */
  private async generateAccessToken(payload: {
    [key: string]: any;
  }): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_AUTH,
      expiresIn: '1h',
    });
  }

  /**
   * Method for Refresh Token generation
   *
   * @private
   * @param {string} userId - User ID.
   * @returns {Promise<string>} - Refresh Token.
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: process.env.JWT_SECRET_AUTH_REF,
        expiresIn: '7d',
      },
    );
  }

  /**
   * Method for Refresh Token encryption
   *
   * @private
   * @param {string} token - Refresh Token.
   * @returns {Promise<string>} - Encrypted Refresh Token.
   */
  private async hashRefreshToken(token: string) {
    return await bcrypt.hash(token, 10);
  }

  /**
   * Token generation during authorization
   *
   * @public
   * @param {User} user - User Data.
   * @returns {Promise<{ accessToken: string; refreshToken: string; }>} - Access and Refresh token.
   */
  async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const payload = {
        userId: user._id.toString(),
        email: user.email,
        roles: user.roles,
      };

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(user._id.toString());

      const hashedToken = await this.hashRefreshToken(refreshToken);
      const newRefreshToken = await this.refreshTokenModel.create({
        user: user._id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await this.userModel.findByIdAndUpdate(user._id, {
        $push: { refreshToken: newRefreshToken._id.toString() },
      });

      return { accessToken, refreshToken: newRefreshToken.token };
    } catch (error) {
      throw new HttpException(
        'Error during token generation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updating an Access Token if the old one has expired
   *
   * @public
   * @param {string} refreshToken - Refresh Token.
   * @returns {Promise<string>} - New Access token.
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const res = await this.refreshTokenModel.findOne({
        token: refreshToken,
      });

      if (!res)
        throw new HttpException(
          'Refresh token not found',
          HttpStatus.NOT_FOUND,
        );

      if (res.expiresAt < new Date())
        throw new HttpException(
          'Refresh token expired',
          HttpStatus.UNAUTHORIZED,
        );

      const user = await this.userModel.findById(res.user.toString());
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const payload = {
        userId: user._id.toString(),
        email: user.email,
        roles: user.roles,
      };

      const accessToken = await this.generateAccessToken(payload);

      return accessToken;
    } catch (error) {
      throw new HttpException(
        'Error during refreshing access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Token renewal if old tokens have expired
   *
   * @public
   * @param {string} refreshToken - Refresh Token.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} - Access and Refresh token.
   */
  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const res = await this.refreshTokenModel.findOne({
        token: refreshToken,
      });
      if (!res)
        throw new HttpException(
          'Refresh token not found',
          HttpStatus.NOT_FOUND,
        );

      const user = await this.userModel.findById(res.user.toString());
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      this.deleteTokens(user._id.toString(), res.token);

      const payload = {
        userId: user._id.toString(),
        email: user.email,
        roles: user.roles,
      };

      const accessToken = await this.generateAccessToken(payload);
      const newRefreshToken = await this.generateRefreshToken(
        user._id.toString(),
      );
      const hashedNewToken = await this.hashRefreshToken(newRefreshToken);

      const newRefreshTokenDoc = await this.refreshTokenModel.create({
        user: user._id,
        token: hashedNewToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await this.userModel.findByIdAndUpdate(user._id, {
        $push: { refreshToken: newRefreshTokenDoc._id },
      });

      return { accessToken, refreshToken: newRefreshTokenDoc.token };
    } catch (error) {
      throw new HttpException(
        'Error during refreshing access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete Refresh token
   *
   * @public
   * @param {string} userId - User ID.
   * @param {string} rt - Refresh Token.
   */
  async deleteTokens(userId: string, rt: string) {
    await this.refreshTokenModel.deleteOne({ token: rt });
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { refreshToken: rt },
    });
  }
}
