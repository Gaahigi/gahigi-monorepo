import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '@/shared/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';

@Module({
  providers: [AuthService, PrismaService, ConfigService, JwtService, UserService],
  controllers: [AuthController]
})
export class AuthModule {}