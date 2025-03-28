import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorLog } from 'src/common/entity/support/errorLog.schema';
import { IErrorLog } from 'src/common/types';

@Injectable()
export class ErrorLogService {
  constructor(
    @InjectModel(ErrorLog.name) private readonly errorLogModel: Model<ErrorLog>,
  ) {}

  /**
   * Logs an error or suspicious activity to the database.
   *
   * @param {IErrorLog} error - Error data.
   */
  async logError(error: IErrorLog) {
    const errorLog = new this.errorLogModel(error);
    await errorLog.save();
  }
}
