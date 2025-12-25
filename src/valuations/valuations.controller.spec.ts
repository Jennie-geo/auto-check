import { Test, TestingModule } from '@nestjs/testing';
import { ValuationsController } from './valuations.controller';

describe('ValuationsController', () => {
  let controller: ValuationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValuationsController],
    }).compile();

    controller = module.get<ValuationsController>(ValuationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
