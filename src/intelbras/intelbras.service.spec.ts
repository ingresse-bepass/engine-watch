import { Test, TestingModule } from '@nestjs/testing';
import { IntelbrasService } from './intelbras.service';

describe('IntelbrasService', () => {
  let service: IntelbrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntelbrasService],
    }).compile();

    service = module.get<IntelbrasService>(IntelbrasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
