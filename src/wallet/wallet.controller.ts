// backend/src/wallet/wallet.controller.ts
import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.id);
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    return this.walletService.getTransactions(req.user.id);
  }

  @Post('fund')
  async fundWallet(@Request() req, @Body() fundWalletDto: FundWalletDto) {
    await this.walletService.fundWallet(req.user.id, fundWalletDto);
    return { message: 'Wallet funded successfully' };
  }

  @Post('transfer')
  async transfer(@Request() req, @Body() transferDto: TransferDto) {
    await this.walletService.transfer(req.user.id, transferDto);
    return { message: 'Transfer successful' };
  }
}