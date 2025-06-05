import { Module } from '@nestjs/common';
import { IntelbrasService } from './intelbras.service';
import { IntelbrasController } from './intelbras.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [IntelbrasController],
  providers: [IntelbrasService],
})
export class IntelbrasModule {}
