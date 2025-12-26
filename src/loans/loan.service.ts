import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { isEmpty, isNil } from 'lodash';
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
    const amountRequested = latestValuation.estimatedValue * 0.8;

    const loan = this.loanRepo.create({
      user: { id: userId },
      vehicle: { id: vehicle.id },
      requestedAmount: amountRequested,
      status: LoanStatus.PENDING,
      eligible: false,
    });

    return this.loanRepo.save(loan);
  }

  async retrieveLoans(): Promise<LoanApplication[]> {
    const loan = await this.loanRepo
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.vehicle', 'vehicle')
      .leftJoin('loan.user', 'user')
      .addSelect(['user.id', 'user.email', 'user.role'])
      .orderBy('loan.createdAt', 'DESC')
      .getMany();
    if (isNil(loan) || isEmpty(loan)) {
      throw new NotFoundException('No loan applications found');
    }
    return loan;
  }
}
