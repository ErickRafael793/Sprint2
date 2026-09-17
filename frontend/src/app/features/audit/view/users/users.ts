import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  BottomNav
} from '../../../../shared/components/bottom-nav/bottom-nav';

import {
  UsersViewModel
} from '../../view-model/users-view-model';


@Component({
  selector: 'app-users',

  imports: [
    BottomNav
  ],

  templateUrl:
    './users.html',

  styleUrl:
    './users.css',

  providers: [
    UsersViewModel
  ]
})
export class Users
  implements OnInit {

  readonly vm: UsersViewModel =
    inject(UsersViewModel);


  ngOnInit(): void {

    this.vm.initialize();

  }

}