// src/transactions/transactions.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { amount, type, receiverId } = createTransactionDto;
    const sender = await this.usersService.findOne(userId);

    if (!sender) {
      throw new BadRequestException('Sender not found');
    }

    if (type === TransactionType.WITHDRAWAL || type === TransactionType.TRANSFER) {
      if (sender.balance < amount) {
        throw new BadRequestException('Insufficient funds');
      }
    }

    let receiver: User | null = null;
    if (type === TransactionType.TRANSFER) {
      if (!receiverId) {
        throw new BadRequestException('Receiver ID is required for transfers');
      }
      receiver = await this.usersService.findOne(receiverId);
      if (!receiver) {
        throw new BadRequestException('Receiver not found');
      }
    }

    const transaction = this.transactionsRepository.create({
      amount: amount,
      type: type,
      sender: sender,
      receiver: receiver, // Explicitly compatible with User | null
    } as Transaction); // Type assertion to match Transaction entity

    // Update balances
    if (type === TransactionType.DEPOSIT) {
      sender.balance += amount;
    } else if (type === TransactionType.WITHDRAWAL) {
      sender.balance -= amount;
    } else if (type === TransactionType.TRANSFER) {
      sender.balance -= amount;
      receiver!.balance += amount; // Non-null assertion since checked above
      await this.usersService.updateBalance(receiver!.id, receiver!.balance);
    }

    await this.usersService.updateBalance(sender.id, sender.balance);
    return this.transactionsRepository.save(transaction); // Returns Promise<Transaction>
  }

  async findAllByUser(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
    });
  }
}