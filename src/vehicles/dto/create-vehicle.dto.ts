import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  vin: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(2000)
  @Max(new Date().getFullYear())
  year: number;

  @IsNumber()
  @Min(0)
  mileage: number;
}
