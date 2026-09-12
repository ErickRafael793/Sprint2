import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { LoginViewModel } from '../../view-model/login-view-model';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [LoginViewModel]
})
export class Login implements OnInit {
ngOnInit(): void {

  this.vm.initialize();

}
  readonly vm = inject(LoginViewModel);

}