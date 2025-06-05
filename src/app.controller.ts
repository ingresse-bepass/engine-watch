import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

  ) {}

  @Get()
  async getHello() {
    return {
      its: 'alive',
      version: '1.3',
      sector: process.env.SECTOR_LIST,
      totemId: process.env.TOTEM_ID,
    };
  }
}
