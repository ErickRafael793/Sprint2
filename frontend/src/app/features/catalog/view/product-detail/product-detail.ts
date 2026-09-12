import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  CurrencyPipe
} from '@angular/common';

import {
  ProductDetailViewModel
} from '../../view-model/product-detail-view-model';


@Component({
  selector: 'app-product-detail',

  imports: [
    CurrencyPipe
  ],

  templateUrl:
    './product-detail.html',

  styleUrl:
    './product-detail.css',

  providers: [
    ProductDetailViewModel
  ]
})
export class ProductDetail
  implements OnInit {

  readonly vm =
    inject(ProductDetailViewModel);


  ngOnInit(): void {

    this.vm.initialize();

  }

}