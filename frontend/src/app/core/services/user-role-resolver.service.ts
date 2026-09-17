import {
  Injectable
} from '@angular/core';

import {
  UserRole
} from '../models/user-session.model';


@Injectable({
  providedIn: 'root'
})
export class UserRoleResolverService {

  resolve(
    userId: number
  ): UserRole {

    if (
      userId === 1 ||
      userId === 2
    ) {

      return 'ADMIN';

    }


    if (
      userId === 3
    ) {

      return 'AUDITOR';

    }


    return 'CLIENTE';

  }

}