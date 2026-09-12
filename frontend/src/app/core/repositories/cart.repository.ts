import {
  CartItem
} from '../models/cart-item.model';

import {
  AddToCartResult
} from '../models/add-to-cart-result.model';

import {
  Product
} from '../models/product.model';


export abstract class CartRepository {

  abstract getItems():
    Promise<CartItem[]>;


  abstract addItem(
    product: Product,
    quantity: number
  ): Promise<AddToCartResult>;


  abstract updateQuantity(
    productId: number,
    quantity: number
  ): Promise<CartItem | null>;


  abstract removeItem(
    productId: number
  ): Promise<boolean>;


  /*
   * US02
   * Limpiar carrito al cerrar sesión.
   */
  abstract clearCart():
    Promise<void>;

}