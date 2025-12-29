import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { isEmpty, isNil } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanApplication } from './loans.entity';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/vehicles/vehicles.entity';
import { LoanStatus } from 'enums/status';
import { Valuation } from '../valuations/valuations.entity';
@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(LoanApplication)
    private readonly loanRepo: Repository<LoanApplication>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,

    @InjectRepository(Vehicle)
    private readonly valuationRepo: Repository<Valuation>,
  ) {}
  private checkEligibility(
    requestedAmount: number,
    tradeInValue: number,
  ): boolean {
    return requestedAmount <= tradeInValue * 0.8;
  }
  async createLoan(userId: number, dto: CreateLoanDto) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id: dto.vehicleId },
      relations: ['valuations'], // include valuations
    });
    if (isNil(vehicle)) {
      throw new NotFoundException('Vehicle not found');
    }

    if (dto.requestedAmount <= 0) {
      throw new BadRequestException('Requested amount must be greater than 0');
    }
    // will get latest valuation saved on db
    const latestValuation = vehicle.valuations?.length
      ? vehicle.valuations[vehicle.valuations.length - 1]
      : await this.valuationRepo.findOne({
          where: { vehicle: { id: vehicle.id } },
          order: { createdAt: 'DESC' },
        });

    if (!latestValuation) {
      throw new BadRequestException('No valuation found for this vehicle');
    }

    // Check eligibility
    const eligible = this.checkEligibility(
      dto.requestedAmount,
      latestValuation.tradeInValue,
    );

    const loan = this.loanRepo.create({
      vehicle,
      valuation: latestValuation,
      user: { id: userId },
      requestedAmount: dto.requestedAmount,
      eligible,
      status: LoanStatus.PENDING,
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
