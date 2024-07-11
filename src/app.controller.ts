import { Controller, Get } from '@nestjs/common';
import { Roles } from './common/decorator/roles.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Roles('public')
  getHello(): string {
    return 'Hello World!';
  }
}
