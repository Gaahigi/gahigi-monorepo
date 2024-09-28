import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from './services/prisma.service';
import { EmailService } from './services/email.service';
import { FileService } from './services/file.service';
import { GroqService } from './services/groq.service';

@Global()
@Module({
  imports: [],
  providers: [
    // PrismaService,
    ConfigService,EmailService, 
    GroqService
    // FileService  
  ],
  exports: [
//  PrismaService,
 ConfigService, EmailService,
 GroqService
  // FileService
  ],
})
export class SharedModule {}