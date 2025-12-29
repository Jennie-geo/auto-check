import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './vehicles.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { isNil } from 'lodash';
import { ValuationsService } from '../valuations/valuations.service';
@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    private readonly valuationsService: ValuationsService,
  ) {}

  async create(dto: CreateVehicleDto) {
    const existing = await this.vehicleRepo.findOneBy({ vin: dto.vin });
    if (!isNil(existing))
      throw new BadRequestException('Vehicle already exists');

    const vehicle = this.vehicleRepo.create(dto);
    return this.vehicleRepo.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getVehicleValuation(vin: string) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { vin },
    });

    if (isNil(vehicle)) {
      throw new NotFoundException('Vehicle vin not found');
    }

    const externalValuation =
      await this.valuationsService.getExternalValuation(vin);

    console.log('kkkkkk', externalValuation);
    let shouldUpdateVehicle = false;

    if (isNil(vehicle.make) && externalValuation.make) {
      vehicle.make = externalValuation.make;
      shouldUpdateVehicle = true;
    }

    if (isNil(vehicle.model) && externalValuation.model) {
      vehicle.model = externalValuation.model;
      shouldUpdateVehicle = true;
    }

    if (isNil(vehicle.year) && externalValuation.year) {
      vehicle.year = externalValuation.year;
      shouldUpdateVehicle = true;
    }

    if (isNil(vehicle.mileage) && externalValuation.mileage_adjustment) {
      vehicle.mileage = externalValuation.mileage_adjustment;
      shouldUpdateVehicle = true;
    }
    if (shouldUpdateVehicle) {
      await this.vehicleRepo.save(vehicle);
    }

    await this.valuationsService.processRapidApiData(
      externalValuation,
      vehicle,
    );
    return vehicle;
  }
}
