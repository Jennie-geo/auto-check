import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ValuationsService {
  async getValuationByVin(vin: string): Promise<number> {
    const url = `https://vin-lookup2.p.rapidapi.com/vehicle-lookup?vin=${vin}`;
    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-host': 'vin-lookup2.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      },
    });
    const data = response.data;
    console.log('vvvvvvv', data);
    // Suppose API returns estimated value in data.estimatedValue
    return data.estimatedValue || 0;
  }
}
