import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/shared/services/prisma.service';
import { EmailService } from 'src/shared/services/email.service';
import { FileService } from 'src/shared/services/file.service';

@Module({
  providers: [UserService, PrismaService,EmailService, FileService ],
  controllers: [UserController],
  exports:[
    UserService,
  ]
})
export class UserModule {}
