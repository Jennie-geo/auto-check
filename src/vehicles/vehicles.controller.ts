import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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
  @Get(':id')
  async getVehicle(@Param('id', ParseIntPipe) id: number) {
    return {
      data: await this.vehiclesService.getVehicleValuation(id),
    };
  }
}
