import { Test, TestingModule } from '@nestjs/testing';
import { IpgeoService } from './ipgeo.service';

describe('IpgeoService', () => {
  let service: IpgeoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpgeoService],
    }).compile();

    service = module.get<IpgeoService>(IpgeoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
