import { Module } from '@nestjs/common';
import { ValuationsController } from './valuations.controller';
import { ValuationsService } from './valuations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Valuation } from './valuations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Valuation])],
  controllers: [ValuationsController],
  providers: [ValuationsService],
  exports: [ValuationsService],
})
export class ValuationsModule {}
