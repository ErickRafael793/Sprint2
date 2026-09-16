import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  BottomNav
} from '../../../../shared/components/bottom-nav/bottom-nav';

import {
  ProductEditViewModel
} from '../../view-model/product-edit-view-model';


@Component({
  selector: 'app-product-edit',

  imports: [
    BottomNav
  ],

  templateUrl:
    './product-edit.html',

  styleUrl:
    './product-edit.css',

  providers: [
    ProductEditViewModel
  ]
})
export class ProductEdit
  implements OnInit {

  readonly vm =
    inject(ProductEditViewModel);


  ngOnInit(): void {

    this.vm.initialize();

  }

}