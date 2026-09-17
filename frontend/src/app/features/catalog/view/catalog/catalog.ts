import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  CurrencyPipe
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  CatalogViewModel
} from '../../view-model/catalog-view-model';

import {
  BottomNav
} from '../../../../shared/components/bottom-nav/bottom-nav';


@Component({
  selector: 'app-catalog',

  imports: [
    RouterLink,
    CurrencyPipe,
    BottomNav
  ],

  templateUrl:
    './catalog.html',

  styleUrl:
    './catalog.css',

  providers: [
    CatalogViewModel
  ]
})
export class Catalog
  implements OnInit {

  readonly vm: CatalogViewModel =
    inject(CatalogViewModel);


  ngOnInit(): void {

    this.vm.initialize();

  }

}