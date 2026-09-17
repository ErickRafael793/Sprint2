import {
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
} from '../repositories/cart.repository';


@Injectable()
export class MockCartRepository
  extends CartRepository {


  private readonly items:
    CartItem[] = [];


  /*
   * US10
   * Obtener artículos.
   */
  async getItems():
    Promise<CartItem[]> {

    await this.simulateDelay(300);

    return this.cloneItems();

  }


  /*
   * US02
   * Limpiar carrito al cerrar sesión.
   */
  async clearCart():
    Promise<void> {

    await this.simulateDelay(200);

    this.items.splice(
      0,
      this.items.length
    );

  }


  /*
   * US09
   * Añadir artículo.
   */
  async addItem(
    product: Product,
    quantity: number
  ): Promise<AddToCartResult> {

    await this.simulateDelay(450);


    if (quantity <= 0) {

      throw new Error(
        'INVALID_QUANTITY'
      );

    }


    const existingItem =
      this.items.find(
        item =>
          item.product.id ===
          product.id
      );


    if (existingItem) {

      existingItem.quantity +=
        quantity;


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


    const newItem:
      CartItem = {

      product: {
        ...product
      },

      quantity

    };


    this.items.push(
      newItem
    );


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


  /*
   * US10
   * Cambiar cantidad.
   */
  async updateQuantity(
    productId: number,
    quantity: number
  ): Promise<CartItem | null> {

    await this.simulateDelay(300);


    if (quantity < 1) {

      throw new Error(
        'INVALID_QUANTITY'
      );

    }


    const item =
      this.items.find(
        current =>
          current.product.id ===
          productId
      );


    if (!item) {

      return null;

    }


    item.quantity =
      quantity;


    return {

      product: {
        ...item.product
      },

      quantity:
        item.quantity

    };

  }


  /*
   * US10
   * Quitar artículo.
   */
  async removeItem(
    productId: number
  ): Promise<boolean> {

    await this.simulateDelay(450);


    const index =
      this.items.findIndex(
        item =>
          item.product.id ===
          productId
      );


    if (index === -1) {

      return false;

    }


    this.items.splice(
      index,
      1
    );


    return true;

  }


  /*
   * Crear copia segura
   * del carrito.
   */
  private cloneItems():
    CartItem[] {

    return this.items.map(
      item => ({

        product: {
          ...item.product
        },

        quantity:
          item.quantity

      })
    );

  }


  /*
   * Simulación de respuesta
   * del repositorio.
   */
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