import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  ProfileViewModel
} from '../../view-model/profile-view-model';


@Component({
  selector: 'app-profile',

  imports: [
    RouterLink
  ],

  templateUrl:
    './profile.html',

  styleUrl:
    './profile.css',

  providers: [
    ProfileViewModel
  ]
})
export class Profile
  implements OnInit {

  readonly vm =
    inject(ProfileViewModel);


  ngOnInit(): void {

    void this.vm.loadSession();

  }

}