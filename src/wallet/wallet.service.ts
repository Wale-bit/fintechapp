import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { AuthService } from '../auth/auth.service';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferDto } from './dto/transfer.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}
  async getBalance(userId: number): Promise<{ balance: number }> {
    const user = await this.authService.findUserById(userId);
    return { balance: user.balance };
  }
  async getTransactions(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: { userId } });
  }

  async fundWallet(userId: number, fundWalletDto: FundWalletDto): Promise<Transaction> {
    const { amount } = fundWalletDto;
    const user = await this.authService.findUserById(userId);

    user.balance += amount;
    await this.userRepository.save(user);

    const transaction = this.transactionRepository.create({
        userId: user.id,
        amount,
        type: 'Deposit',
        senderEmail: user.email,
        receiverEmail: null, // Ensure this matches the nullable type
        createdAt: new Date(),
      });
      
      return this.transactionRepository.save(transaction);
  }

  async transfer(userId: number, transferDto: TransferDto): Promise<Transaction> {
    const { amount, receiverId } = transferDto;
    const sender = await this.authService.findUserById(userId);
    const receiver = await this.authService.findUserById(receiverId);

    if (sender.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await this.userRepository.save([sender, receiver]);

    const transaction = this.transactionRepository.create({
      userId: sender.id,
      amount,
      type: 'Transfer',
      senderEmail: sender.email,
      receiverEmail: receiver.email,
      createdAt: new Date(),
    });
    

    return this.transactionRepository.save(transaction);
  }
}