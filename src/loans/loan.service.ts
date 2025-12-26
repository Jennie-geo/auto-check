import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { isNil } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanApplication } from './loans.entity';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/vehicles/vehicles.entity';
import { LoanStatus } from 'enums/status';
@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(LoanApplication)
    private readonly loanRepo: Repository<LoanApplication>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}
  async createLoan(userId: number, dto: CreateLoanDto) {
    // Fetch vehicle with valuations
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: dto.vehicleId },
      relations: ['valuations'],
      order: { createdAt: 'DESC' },
    });

    if (isNil(vehicle)) throw new NotFoundException('Vehicle not found');

    // Use latest valuation for loan, because valuation changes over time and a vehicle can have multiple valuation
    const latestValuation = vehicle.valuations[vehicle.valuations.length - 1];
    const amountRequested = latestValuation.estimatedValue * 0.8; // e.g., 80% of value

    const loan = this.loanRepo.create({
      user: { id: userId },
      vehicle: { id: vehicle.id },
      requestedAmount: amountRequested,
      status: LoanStatus.PENDING,
    });

    return this.loanRepo.save(loan);
  }
}
