import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('basic')
export class BasicController {
  @Get()
  public async getBasicInfo(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('req', req);

    return 'ok';
  }
}
