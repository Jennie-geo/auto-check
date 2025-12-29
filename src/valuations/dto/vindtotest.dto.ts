import { IsString } from 'class-validator';

export class VinDto {
  @IsString()
  vin: string;
}
