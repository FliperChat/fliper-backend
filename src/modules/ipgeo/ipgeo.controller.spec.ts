import { Test, TestingModule } from '@nestjs/testing';
import { IpgeoController } from './ipgeo.controller';

describe('IpgeoController', () => {
  let controller: IpgeoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IpgeoController],
    }).compile();

    controller = module.get<IpgeoController>(IpgeoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
