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

  @Post('/get-current-orders')
  async getCurrentOrders() {
    return await this.appService.getCurrentOrders();
  }

  @Post('/get-order-by-orderid')
  async getExistingOrder(@Body() body) {
    return await this.appService.getExistingOrder(body.orderId);
  }

  @Post('/submit-order')
  async submitOrder(@Body() orderData: OrderData) {
    return await this.appService.submitOrder(orderData);
  }
}
