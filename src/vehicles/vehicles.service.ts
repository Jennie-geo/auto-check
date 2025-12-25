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
@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
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

  async getVehicleValuation(vehicleId: number) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
      relations: ['valuations'],
      order: {
        valuations: {
          createdAt: 'DESC',
        },
      },
    });

    if (isNil(vehicle)) {
      throw new NotFoundException('Vehicle not found');
    }

    // if (!vehicle.valuations || vehicle.valuations.length === 0) {
    //   throw new NotFoundException('No valuation found for this vehicle');
    // }

    return vehicle;
  }
}
