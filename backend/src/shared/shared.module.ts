import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from './services/prisma.service';
import { EmailService } from './services/email.service';
import { FileService } from './services/file.service';

@Global()
@Module({
  imports: [],
  providers: [
    // PrismaService,
    ConfigService,EmailService, 
    // FileService  
  ],
  exports: [
//  PrismaService,
 ConfigService, EmailService,
  // FileService
  ],
})
export class SharedModule {}