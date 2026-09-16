import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  CurrencyPipe
} from '@angular/common';

import {
  BottomNav
} from '../../../../shared/components/bottom-nav/bottom-nav';

import {
  CartViewModel
} from '../../view-model/cart-view-model';


@Component({
  selector: 'app-cart',

  imports: [
    CurrencyPipe,
    BottomNav
  ],

  templateUrl:
    './cart.html',

  styleUrl:
    './cart.css',

  providers: [
    CartViewModel
  ]
})
export class Cart
  implements OnInit {

  readonly vm: CartViewModel =
    inject(CartViewModel);


  ngOnInit(): void {

    this.vm.initialize();

  }

}