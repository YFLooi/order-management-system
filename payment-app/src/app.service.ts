import { Injectable, BadRequestException } from '@nestjs/common';
import ServerConfig from './config/server.config';
import _ from 'lodash';
import axios from 'axios';

export enum PaymentStatus {
  DECLINED = 'declined',
  CONFIRMED = 'confirmed',
  ERROR = 'error',
}

@Injectable()
export class AppService {
  getHello() {
    return `Hello World!`;
  }

  async processPayment(orderId: string) {
    console.log(`orderId received: ${orderId}`);

    // Verify order with orderId does exist
    try {
      const orderObj = await axios
        .post(
          `${ServerConfig.getOrderAppBaseUrl()}/orders/get-order-by-orderid`,
          {
            orderId: orderId,
          },
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(`Unabled to verify payment. Err: ${err?.message}`);
        });

      // For some reason, lodash's _.isEmpty breaks here...
      if (!orderObj?._id) {
        console.log(
          `Record for orderId cannot be found: "${orderId}". Terminating`,
        );
        throw new Error(`Record for orderId cannot be found: "${orderId}"`);
      } else {
        console.log(`orderId "${orderId}" verified. Proceeding payment`);

        // Randomly decide the payment response
        const randNumber = Math.random();
        if (randNumber > 0.5) {
          console.log(`Payment for orderId "${orderId}" approved`);
          return { paymentStatus: PaymentStatus.CONFIRMED };
        } else {
          console.log(`Payment for orderId "${orderId}" declined`);
          return { paymentStatus: PaymentStatus.DECLINED };
        }
      }
    } catch (err) {
      return {
        paymentStatus: PaymentStatus.ERROR,
        error: err?.message,
      };
    }
  }
}
