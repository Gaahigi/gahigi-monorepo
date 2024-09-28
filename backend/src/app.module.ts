import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { configValidationSchema } from './shared/config';
import { CareerModule } from './career/career.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
    validationSchema: configValidationSchema
  }),
    CareerModule, 
  //  AuthModule, UserModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
