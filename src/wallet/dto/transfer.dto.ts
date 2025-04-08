// backend/src/wallet/dto/transfer.dto.ts
import { IsNumber, Min } from 'class-validator';

export class TransferDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  receiverId: number;
}