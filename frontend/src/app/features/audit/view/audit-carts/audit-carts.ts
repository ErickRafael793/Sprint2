import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  BottomNav
} from '../../../../shared/components/bottom-nav/bottom-nav';

import {
  AuditCartsViewModel
} from '../../view-model/audit-carts-view-model';


@Component({
  selector: 'app-audit-carts',

  imports: [
    BottomNav
  ],

  templateUrl:
    './audit-carts.html',

  styleUrl:
    './audit-carts.css',

  providers: [
    AuditCartsViewModel
  ]
})
export class AuditCarts
  implements OnInit {

  readonly vm:
    AuditCartsViewModel =
      inject(
        AuditCartsViewModel
      );


  ngOnInit(): void {

    this.vm.initialize();

  }

}