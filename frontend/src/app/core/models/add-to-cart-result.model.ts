import {
  CartItem
} from './cart-item.model';


export interface AddToCartResult {

  item: CartItem;

  wasUpdated: boolean;

}