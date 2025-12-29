import axios from 'axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Valuation } from './valuations.entity';
import { Repository } from 'typeorm';
import { pick } from 'lodash';
dotenv.config();

console.log('bbbbb', process.env.RAPIDAPI_KEY);

@Injectable()
export class ValuationsService {
  constructor(
    @InjectRepository(Valuation)
    private readonly valuationRepo: Repository<Valuation>,
  ) {}

  async getExternalValuation(vinNum: string) {
    try {
      const vin = vinNum.toString();
      const response = await axios.request({
        method: 'GET',
        url: `https://vin-lookup2.p.rapidapi.com/vehicle-lookup`,
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'vin-lookup2.p.rapidapi.com',
        },
        params: { vin },
      });

      return response.data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async processRapidApiData(externalValuation, vehicle) {
    console.log('vehiiii', vehicle);
    try {
      const {
        trade_in_value: tradeInValue,
        adjusted_trade_in_value: adjustedTradeInValue,
        retail_value: retailValue,
        mileage_adjustment: mileageAdjustment,
      } = pick(externalValuation, [
        'trade_in_value',
        'adjusted_trade_in_value',
        'retail_value',
        'mileage_adjustment',
      ]);
      const valuation = this.valuationRepo.create({
        tradeInValue,
        adjustedTradeInValue,
        retailValue,
        mileageAdjustment,
        source: 'rapidapi',
        vehicle,
        meta: { ...externalValuation },
      });

      await this.valuationRepo.save(valuation);
    } catch (error) {
      throw new Error(`Failed to get valuation: ${(error as Error).message}`);
    }
  }
}
