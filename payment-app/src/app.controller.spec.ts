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
      const output1 = await appController.processPayment('testOrder');
      expect(output1).toEqual(expectedOutput1);

      const expectedOutput2 = { paymentStatus: PaymentStatus.DECLINED };
      const output2 = await appController.processPayment('falseOrder');
      expect(output2).toEqual(expectedOutput2);
    });
  });
});
