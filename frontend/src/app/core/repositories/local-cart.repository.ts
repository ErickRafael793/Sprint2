import {
  inject,
  Injectable
} from '@angular/core';

import {
  Product
} from '../models/product.model';

import {
  CartItem
} from '../models/cart-item.model';

import {
  AddToCartResult
} from '../models/add-to-cart-result.model';

import {
  CartRepository
} from './cart.repository';

import {
  SessionRepository
} from './session.repository';


const STORAGE_PREFIX = 'shopicaros_cart_';


@Injectable()
export class LocalCartRepository
  extends CartRepository {

  private readonly sessionRepository =
    inject(SessionRepository);


  async getItems(): Promise<CartItem[]> {

    const items =
      await this.readItems();

    return this.cloneItems(items);
  }


  async addItem(
    product: Product,
    quantity: number
  ): Promise<AddToCartResult> {

    if (quantity <= 0) {
      throw new Error('INVALID_QUANTITY');
    }

    const items =
      await this.readItems();

    const existingItem =
      items.find(
        item =>
          item.product.id === product.id
      );

    if (existingItem) {

      existingItem.quantity += quantity;

      await this.writeItems(items);

      return {
        item: {
          product: {
            ...existingItem.product
          },
          quantity:
            existingItem.quantity
        },
        wasUpdated: true
      };
    }


    const newItem: CartItem = {
      product: {
        ...product
      },
      quantity
    };

    items.push(newItem);

    await this.writeItems(items);

    return {
      item: {
        product: {
          ...newItem.product
        },
        quantity:
          newItem.quantity
      },
      wasUpdated: false
    };
  }


  async updateQuantity(
    productId: number,
    quantity: number
  ): Promise<CartItem | null> {

    if (quantity < 1) {
      throw new Error('INVALID_QUANTITY');
    }

    const items =
      await this.readItems();

    const item =
      items.find(
        current =>
          current.product.id === productId
      );

    if (!item) {
      return null;
    }

    item.quantity = quantity;

    await this.writeItems(items);

    return {
      product: {
        ...item.product
      },
      quantity:
        item.quantity
    };
  }


  async removeItem(
    productId: number
  ): Promise<boolean> {

    const items =
      await this.readItems();

    const index =
      items.findIndex(
        item =>
          item.product.id === productId
      );

    if (index === -1) {
      return false;
    }

    items.splice(index, 1);

    await this.writeItems(items);

    return true;
  }


  async clearCart(): Promise<void> {

    const key =
      await this.getStorageKey();

    localStorage.removeItem(key);
  }


  private async readItems():
    Promise<CartItem[]> {

    const key =
      await this.getStorageKey();

    const stored =
      localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    try {

      const parsed =
        JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as CartItem[];

    } catch {

      localStorage.removeItem(key);

      return [];
    }
  }


  private async writeItems(
    items: CartItem[]
  ): Promise<void> {

    const key =
      await this.getStorageKey();

    localStorage.setItem(
      key,
      JSON.stringify(items)
    );
  }


  private async getStorageKey():
    Promise<string> {

    const session =
      await this.sessionRepository
        .getCurrentSession();

    const userId =
      session?.id ?? 'guest';

    return `${STORAGE_PREFIX}${userId}`;
  }


  private cloneItems(
    items: CartItem[]
  ): CartItem[] {

    return items.map(
      item => ({
        product: {
          ...item.product
        },
        quantity:
          item.quantity
      })
    );
  }

}
