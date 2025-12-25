import { DataSource } from 'typeorm';
import { Vehicle } from './src/vehicles/vehicles.entity';
import { Valuation } from './src/valuations/valuations.entity';
import { LoanApplication } from './src/loans/loans.entity';
import { User } from './src/users/users.entity';
// to seed this data => npx ts-node seed.ts
// to reset test.db => rm test.db
const dataSource = new DataSource({
  type: 'sqlite',
  database: 'test.db',
  entities: [Vehicle, Valuation, LoanApplication, User],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const vehicleRepo = dataSource.getRepository(Vehicle);
  const valuationRepo = dataSource.getRepository(Valuation);

  const vehicles = [
    {
      vin: '1HGCM82633A004352',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      mileage: 15000,
    },
    {
      vin: '1FTFW1EF1EFA12345',
      make: 'Ford',
      model: 'F-150',
      year: 2019,
      mileage: 30000,
    },
    {
      vin: '1FTFW1EF1EFA22222',
      make: 'MERCEDES',
      model: 'M-250',
      year: 2021,
      mileage: 40000,
    },
  ];

  for (const vehicle of vehicles) {
    const vehi = vehicleRepo.create(vehicle);
    await vehicleRepo.save(vehi);
    const valuation = valuationRepo.create({
      estimatedValue: Math.floor(Math.random() * 10000) + 10000, // simulate valuation
      source: 'MANUAL_CHECK',
      vehicle: vehi,
    });
    await valuationRepo.save(valuation);
  }

  console.log('Seeding complete!');
  process.exit();
}

seed();
