import {
  Component,
  inject,
  OnInit
} from '@angular/core';
import {
  BottomNav
} from '../../../../shared/components/bottom-nav/bottom-nav';
import {
  ProductCreateViewModel
} from '../../view-model/product-create-view-model';


@Component({
  selector: 'app-product-create',

  imports: [
    BottomNav
  ],

  templateUrl:
    './product-create.html',

  styleUrl:
    './product-create.css',

  providers: [
    ProductCreateViewModel
  ]
})
export class ProductCreate
  implements OnInit {

  readonly vm =
    inject(ProductCreateViewModel);


  ngOnInit(): void {

    this.vm.initialize();

  }

}