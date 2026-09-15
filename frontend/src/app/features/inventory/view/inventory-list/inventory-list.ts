import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  BottomNav
} from '../../../../shared/components/bottom-nav/bottom-nav';

import {
  InventoryListViewModel
} from '../../view-model/inventory-list-view-model';


@Component({
  selector: 'app-inventory-list',

  imports: [
  BottomNav,
  DecimalPipe
],

  templateUrl:
    './inventory-list.html',

  styleUrl:
    './inventory-list.css',

  providers: [
    InventoryListViewModel
  ]
})
export class InventoryList
  implements OnInit {

  readonly vm:
    InventoryListViewModel =
      inject(
        InventoryListViewModel
      );


  ngOnInit(): void {

    void this.vm.initialize();

  }

}