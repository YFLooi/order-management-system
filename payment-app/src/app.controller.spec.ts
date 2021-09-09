import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentStatus } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    // Define modules to be used for testing. Mimics app.module
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return { paymentStatus: PaymentStatus.CONFIRMED/DECLINED }', async () => {
      const expectedOutput1 = { paymentStatus: PaymentStatus.CONFIRMED };
      const expectedOutput2 = { paymentStatus: PaymentStatus.DECLINED };

      // testOrder is a valid test order in the db
      const output = await appController.processPayment({
        orderId: 'testOrder',
      });
      // paymentStatus is randomly confirmed/denied, hence need to account for both
      try {
        expect(output).toEqual(expectedOutput1);
      } catch (err) {
        if (output?.paymentStatus) {
          expect(output).toEqual(expectedOutput2);
        } else {
          throw err;
        }
      }
    });

    it('should return BadException error', async () => {
      // falseOrder is a fake order in the db
      const output = await appController.processPayment({
        orderId: 'falseOrder',
      });

      expect(output.paymentStatus).toEqual('error');
    });
  });
});
