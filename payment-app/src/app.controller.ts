import { Body, Param, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/process-payment/:orderId')
  processPayment(@Param() params) {
    return this.appService.processPayment(params.orderId);
  }
}
