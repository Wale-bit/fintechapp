// src/transactions/transactions.controller.ts
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Transaction created' })
  async create(@Body() createTransactionDto: CreateTransactionDto, @Body('user') user: any) {
    return this.transactionsService.create(user.sub, createTransactionDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of transactions' })
  async findAll(@Body('user') user: any) {
    return this.transactionsService.findAllByUser(user.sub);
  }
}