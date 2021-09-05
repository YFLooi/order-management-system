import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderData, OrderType } from '@src/app.type';
import orderRecord, {
  OrderStatus,
} from '@src/sub-module/order-recording/order-record.model';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async changeRecord(orderData: OrderData) {
    console.log(`orderData received: ${JSON.stringify(orderData, null, 2)}`);
    if (!orderData.orderId) {
      throw new BadRequestException('Invalid payload: No orderId received');
    }

    if (orderData.orderType == OrderType.CREATE_ORDER) {
      console.log(`Request received to create new order`);
      const newOrderRecord = await orderRecord.create({
        orderId: orderData.orderId,
        description: orderData.orderDescription,
        status: OrderStatus.PENDING,
      });

      return `Successfully created new order of orderId ${orderData.orderId}`;
    } else if (orderData.orderType == OrderType.CANCEL_ORDER) {
      console.log(`Request received to cancel existing order`);
      const deletedOrderRecord = await orderRecord.deleteOne({
        orderId: orderData.orderId,
      });

      return `Successfully deleted order of orderId ${orderData.orderId}`;
    } else {
      throw new BadRequestException('Invalid orderType provided');
    }
  }
}
