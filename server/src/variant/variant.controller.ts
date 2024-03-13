import { Body, Controller, Post } from '@nestjs/common';
import { VariantService } from './variant.service';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post('active')
  async findAllByIds(@Body() ids: number[]) {
    return this.variantService.findByIds(ids);
  }

}
