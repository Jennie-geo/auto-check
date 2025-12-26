import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vehicle } from '../vehicles/vehicles.entity';
import { Valuation } from '../valuations/valuations.entity';
import { LoanStatus } from '../../enums/status';
import { User } from '../users/users.entity';
@Entity()
export class LoanApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.loanApplications)
  vehicle: Vehicle;

  @ManyToOne(() => Valuation)
  valuation: Valuation;

  @Column('float')
  requestedAmount: number;

  @Column({
    type: 'text',
    default: LoanStatus.PENDING,
  })
  status: LoanStatus;

  @Column({ default: false })
  eligible: boolean;

  @Column({ nullable: true })
  rejectionReason?: string;

  @ManyToOne(() => User, (user) => user.loanApplications)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
