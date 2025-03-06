import { Global, Module } from '@nestjs/common';
import { ErrorLogService } from './errorLog.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ErrorLog,
  ErrorLogSchema,
} from 'src/common/entity/support/errorLog.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ErrorLog.name, schema: ErrorLogSchema },
    ]),
  ],
  providers: [ErrorLogService],
  exports: [ErrorLogService],
})
export class ErrorLogModule {}
