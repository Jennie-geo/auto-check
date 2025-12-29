import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Get()
  async getVehicles() {
    return {
      data: await this.vehiclesService.findAll(),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get(':vin')
  async getVehicle(@Param('vin') vin: string) {
    return {
      data: await this.vehiclesService.getVehicleValuation(vin),
    };
  }
}
