import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Esta es una API desarrollada para un Challenge de Conexa. Dirigirse a la ruta /api para la documentacion respectiva de cada uno de los endpoints.';
  }
}
