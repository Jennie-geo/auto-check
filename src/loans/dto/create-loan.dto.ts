import { IsInt } from 'class-validator';

export class CreateLoanDto {
  @IsInt()
  vehicleId: number;
}
