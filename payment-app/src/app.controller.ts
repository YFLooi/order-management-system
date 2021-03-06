import { Body, Param, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
  @Post('/process-payment/:orderId')
  processPayment(@Param() params) {
    return this.appService.processPayment(params.orderId);
  }
}
