import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntelbrasModule } from './intelbras/intelbras.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), IntelbrasModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
