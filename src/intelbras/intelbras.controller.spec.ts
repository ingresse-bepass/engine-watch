import { Test, TestingModule } from '@nestjs/testing';
import { IntelbrasController } from './intelbras.controller';
import { IntelbrasService } from './intelbras.service';

describe('IntelbrasController', () => {
  let controller: IntelbrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntelbrasController],
      providers: [IntelbrasService],
    }).compile();

    controller = module.get<IntelbrasController>(IntelbrasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
