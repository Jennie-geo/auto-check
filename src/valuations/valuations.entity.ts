import { Vehicle } from '../vehicles/vehicles.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Valuation {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column({ nullable: true })
  //   vin: string;

  @Column('decimal', { nullable: true })
  tradeInValue: number;

  @Column('decimal', { nullable: true })
  adjustedTradeInValue: number;

  @Column('decimal', { nullable: true })
  retailValue: number;

  @Column('decimal', { nullable: true })
  mileageAdjustment: number;

  @Column()
  source: string;

  @Column({ type: 'simple-json', nullable: true })
  meta: Record<string, any>;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.valuations, {
    onDelete: 'CASCADE',
  })
  vehicle: Vehicle;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
