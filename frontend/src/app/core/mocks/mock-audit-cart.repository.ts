import {
  Injectable
} from '@angular/core';

import {
  AuditCart
} from '../models/audit-cart.model';

import {
  AuditCartRepository
} from '../repositories/audit-cart.repository';


@Injectable()
export class MockAuditCartRepository
  extends AuditCartRepository {


  private readonly carts:
    AuditCart[] = [

      {
        id: 7,
        userId: 1,
        date: '08 SEP 2026',

        items: [

          {
            productId: 1,
            title: 'Mochila urbana',
            quantity: 2
          },

          {
            productId: 2,
            title: 'Playera suave',
            quantity: 1
          }

        ]
      },

      {
        id: 6,
        userId: 4,
        date: '07 SEP 2026',
        items: []
      },

      {
        id: 5,
        userId: 2,
        date: '06 SEP 2026',
        items: []
      }

    ];


  async getGlobalCarts():
    Promise<AuditCart[]> {

    await this.simulateDelay(
      600
    );


    return this.carts.map(
      cart => ({

        ...cart,

        items:
          cart.items.map(
            item => ({
              ...item
            })
          )

      })
    );

  }


  private async simulateDelay(
    milliseconds: number
  ): Promise<void> {

    await new Promise<void>(
      resolve => {

        setTimeout(
          resolve,
          milliseconds
        );

      }
    );

  }

}