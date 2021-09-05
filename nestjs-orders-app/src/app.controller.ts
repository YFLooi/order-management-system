import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Post('/chkFunction')
  getHello(): string {
    return this.appService.changeRecord();
  }
}
