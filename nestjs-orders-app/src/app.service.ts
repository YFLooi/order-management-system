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

  async getCurrentOrders() {
    try {
      const currentOrders = await orderRecord.find({}).sort({ createdAt: -1 });

      return currentOrders;
    } catch (err) {
      throw new BadRequestException(
        `Err create new order. Err: ${err?.message}`,
      );
    }
  }

  async submitOrder(orderData: OrderData) {
    console.log(`orderData received: ${JSON.stringify(orderData, null, 2)}`);
    if (!orderData.orderId) {
      throw new BadRequestException('Invalid payload: No orderId received');
    }

    if (orderData.orderType == OrderType.CREATE_ORDER) {
      console.log(`Request received to create new order`);

      try {
        await orderRecord.create({
          orderId: orderData.orderId,
          description: orderData.orderDescription,
          status: OrderStatus.PENDING,
        });

        return `Successfully created new order of orderId ${orderData.orderId}`;
      } catch (err) {
        throw new BadRequestException(
          `Err create new order. Err: ${err?.message}`,
        );
      }
    } else if (orderData.orderType == OrderType.CANCEL_ORDER) {
      console.log(`Request received to cancel existing order`);

      try {
        await orderRecord.deleteOne({
          orderId: orderData.orderId,
        });

        return `Successfully deleted order of orderId ${orderData.orderId}`;
      } catch (err) {
        throw new BadRequestException(
          `Err cancelling existing order. Err: ${err?.message}`,
        );
      }
    } else {
      throw new BadRequestException('Invalid orderType provided');
    }
  }
}
