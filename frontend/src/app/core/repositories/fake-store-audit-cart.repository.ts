import {
  inject,
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  firstValueFrom
} from 'rxjs';

import {
  AuditCartRepository
} from './audit-cart.repository';

import {
  AuditCart
} from '../models/audit-cart.model';

import {
  FakeStoreCart
} from '../models/fake-store-cart.model';

import {
  Product
} from '../models/product.model';


@Injectable()
export class FakeStoreAuditCartRepository
  extends AuditCartRepository {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    'https://fakestoreapi.com';


  async getGlobalCarts():
    Promise<AuditCart[]> {

    /*
     * Ejecutamos las dos peticiones
     * al mismo tiempo.
     */
    const [
      carts,
      products
    ] =
      await Promise.all([

        firstValueFrom(
          this.http.get<FakeStoreCart[]>(
            `${this.baseUrl}/carts`
          )
        ),

        firstValueFrom(
          this.http.get<Product[]>(
            `${this.baseUrl}/products`
          )
        )

      ]);


    /*
     * Mapa:
     *
     * productId -> title
     *
     * Así evitamos buscar en todo el
     * arreglo para cada producto.
     */
    const productTitles =
      new Map<number, string>(
        products.map(
          product => [
            product.id,
            product.title
          ]
        )
      );


    return carts
      .map(
        cart => ({

          id:
            cart.id,

          userId:
            cart.userId,

          date:
            this.formatDate(
              cart.date
            ),

          items:
            (cart.products ?? [])
              .map(
                item => ({

                  productId:
                    item.productId,

                  title:
                    productTitles.get(
                      item.productId
                    ) ??
                    `Producto #${item.productId}`,

                  quantity:
                    item.quantity

                })
              )

        })
      )
      .sort(
        (first, second) =>
          second.id - first.id
      );
  }


  private formatDate(
    value: string
  ): string {

    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;
    }


    return new Intl.DateTimeFormat(
      'es-MX',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
      .format(date)
      .toUpperCase();
  }
}