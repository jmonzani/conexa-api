import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return root message', () => {
      expect(appController.getHello()).toBe(
        'Esta es una API desarrollada para un Challenge de Conexa. Dirigirse a la ruta /api para la documentacion respectiva de cada uno de los endpoints.',
      );
    });
  });
});
