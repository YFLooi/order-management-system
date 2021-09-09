import { Test, TestingModule } from '@nestjs/testing';
import _ from 'lodash';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderData, OrderType } from './app.type';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('/orders', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
    it('should get current all orders"', async () => {
      const output = await appController.getCurrentOrders();
      console.log(output);
      try {
        // If no currentOrders available
        expect(output).toEqual(expect.objectContaining({}));
      } catch (err) {
        if (!_.isEmpty(output)) {
          expect(output).toEqual(expect.arrayContaining([{}]));
        } else {
          throw new Error(err?.message);
        }
      }
    });
    // it('should get order by orderId"', async () => {
    //   const output = await appController.getExistingOrder({
    //     orderId: 'testOrder',
    //   });
    //   expect(output).toEqual(expect.objectContaining({}));
    // });
    // it('should submit order', () => {
    //   const creationOrderData = {
    //     orderType: OrderType.CREATE_ORDER,
    //     orderId: 'abc1234',
    //     orderDescription: 'someTestOrder',
    //   };
    //   expect(appController.submitOrder(creationOrderData)).toBe('Hello World!');

    //   const cancellationOrderData = {
    //     orderType: OrderType.CANCEL_ORDER,
    //     orderId: 'abc1234',
    //     orderDescription: 'someTestOrder',
    //   };
    //   expect(appController.submitOrder(cancellationOrderData)).toBe(
    //     'Hello World!',
    //   );
    // });
  });
});
