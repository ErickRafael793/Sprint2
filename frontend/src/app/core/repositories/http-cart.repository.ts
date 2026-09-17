import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  firstValueFrom
} from 'rxjs';

import {
  CartRepository
} from './cart.repository';

import {
  CartItem
} from '../models/cart-item.model';

import {
  AddToCartResult
} from '../models/add-to-cart-result.model';

import {
  Product
} from '../models/product.model';


const BASE_URL = 'http://localhost:3000/carts';


@Injectable()
export class HttpCartRepository extends CartRepository {

  constructor(private http: HttpClient) {
    super();
  }

  async getItems(): Promise<CartItem[]> {
    return firstValueFrom(
      this.http.get<CartItem[]>(BASE_URL)
    );
  }

  async addItem(
    product: Product,
    quantity: number
  ): Promise<AddToCartResult> {
    return firstValueFrom(
      this.http.post<AddToCartResult>(BASE_URL, {
        product,
        quantity
      })
    );
  }

  async updateQuantity(
    productId: number,
    quantity: number
  ): Promise<CartItem | null> {
    try {
      return await firstValueFrom(
        this.http.put<CartItem>(`${BASE_URL}/${productId}`, {
          quantity
        })
      );
    } catch {
      return null;
    }
  }

  async removeItem(
    productId: number
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete(`${BASE_URL}/${productId}`)
      );
      return true;
    } catch {
      return false;
    }
  }

  async clearCart(): Promise<void> {
    // No implementado en el backend todavía (pertenece a US02)
  }

}