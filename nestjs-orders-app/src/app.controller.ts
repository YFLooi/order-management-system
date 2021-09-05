import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderData } from '@src/app.type';

@Controller('/orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/submitOrder')
  async changeRecord(@Body() orderData: OrderData) {
    return await this.appService.changeRecord(orderData);
  }
}
