import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { configValidationSchema } from './shared/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
    validationSchema: configValidationSchema
  }), 
  //  AuthModule, UserModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
