// src/transactions/transaction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty()
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  @ApiProperty()
  type: TransactionType;

  @ManyToOne(() => User, (user) => user.id)
  @ApiProperty()
  sender: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @ApiProperty()
  receiver: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  timestamp: Date;
}