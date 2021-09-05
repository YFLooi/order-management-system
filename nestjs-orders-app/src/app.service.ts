import { Injectable } from '@nestjs/common';
import orderRecord from '@src/sub-module/order-recording/order-record.model';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
