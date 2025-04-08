// src/transactions/dto/create-transaction.dto.ts
import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { TransactionType } from '../transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsEnum(TransactionType)
  @ApiProperty()
  type: TransactionType;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  receiverId?: number;
}