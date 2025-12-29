import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicles.entity';
// import { ValuationsService } from '../valuations/valuations.service';
import { ValuationsModule } from 'src/valuations/valuations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), ValuationsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
