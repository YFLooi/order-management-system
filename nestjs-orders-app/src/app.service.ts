import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderData, OrderType } from '@src/app.type';
import orderRecord, {
  OrderStatus,
  PaymentStatus,
} from '@src/sub-module/order-recording/order-record.model';
import _ from 'lodash';
import { HttpService } from '@nestjs/axios';
import { map, filter } from 'rxjs/operators';
import ServerConfig from '@src/config/server.config';
import axios from 'axios';
import { sleep } from '@src/helper/utils.helper';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCurrentOrders(): Promise<any> {
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
        const newOrder = await orderRecord.create({
          orderId: orderData.orderId,
          description: orderData.orderDescription,
          status: OrderStatus.PENDING,
        });

        console.log(
          `Successfully created new order of orderId ${newOrder.orderId}. Now verifying payment`,
        );
        const paymentStatus: { [key: string]: any } = await axios
          .post(
            `${ServerConfig.getPaymentAppBaseUrl()}/process-payment/${
              newOrder.orderId
            }`,
          )
          .then((res) => {
            return res.data;
          });

        console.log(
          `Obtained paymentStatus. Checking... || ${JSON.stringify(
            paymentStatus,
            null,
            2,
          )}`,
        );
        if (paymentStatus?.paymentStatus == PaymentStatus.CONFIRMED) {
          await orderRecord.updateOne(
            {
              orderId: newOrder.orderId,
            },
            {
              status: OrderStatus.CONFIRMED,
            },
          );

          // Move orders after x seconds to "delivered" state
          await sleep(5000);
          await orderRecord.updateOne(
            {
              orderId: newOrder.orderId,
            },
            {
              status: OrderStatus.DELIVERED,
            },
          );
        } else {
          await orderRecord.updateOne(
            {
              orderId: newOrder.orderId,
            },
            {
              status: OrderStatus.CANCELLED,
            },
          );
        }
      } catch (err) {
        throw new BadRequestException(
          `Err create new order. Err: ${err?.message}`,
        );
      }

      return `Successfully created new order Doc and confirmed the purchase for orderId ${orderData.orderId}`;
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

  async getExistingOrder(orderId: string) {
    try {
      console.log(`Attempting to find order with orderId "${orderId}"`);
      const currentOrder = await orderRecord.findOne({ orderId: orderId });

      if (currentOrder?._id) {
        return currentOrder;
      } else {
        return {};
      }
    } catch (err) {
      throw new BadRequestException(
        `Err findng existing order with orderId "${orderId}". Err: ${err?.message}`,
      );
    }
  }
}
