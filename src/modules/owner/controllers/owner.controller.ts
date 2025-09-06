import { Controller, Injectable, Post, Req, Res } from '@nestjs/common';
import { OwnerService } from '../providers/owner.service';

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post('create/staff')
  public async createStaff(@Req() req: Request, @Res() res: Response) {}
}
