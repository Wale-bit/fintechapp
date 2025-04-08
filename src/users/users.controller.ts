// src/users/users.controller.ts
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UnauthorizedException } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Get current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Body('user') user: any) {
    return this.usersService.findOne(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Get user balance' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBalance(@Body('user') user: any) {
    const currentUser = await this.usersService.findOne(user.sub);
    if (!currentUser) {
      throw new UnauthorizedException('User not found');
    }
    return { balance: currentUser.balance };
  }
}