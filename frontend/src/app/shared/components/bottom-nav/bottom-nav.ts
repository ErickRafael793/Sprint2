import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  BottomNavViewModel
} from '../../view-model/bottom-nav-view-model';


@Component({
  selector: 'app-bottom-nav',

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl:
    './bottom-nav.html',

  styleUrl:
    './bottom-nav.css',

  providers: [
    BottomNavViewModel
  ]
})
export class BottomNav
  implements OnInit {

  readonly vm:
    BottomNavViewModel =
      inject(
        BottomNavViewModel
      );


  ngOnInit(): void {

    void this.vm.initialize();

  }

}