import { Body, Controller, Post } from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { VinDto } from './dto/vindtotest.dto';

@Controller('valuations')
export class ValuationsController {
  constructor(private readonly valuationService: ValuationsService) {}
  @Post()
  async retrieveValu(@Body() vindto: VinDto) {
    console.log('vin', vindto);
    const data = await this.valuationService.getExternalValuation(vindto.vin);
    console.log('GGGGGGG', data);
  }
}
