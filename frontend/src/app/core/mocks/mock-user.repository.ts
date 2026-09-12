import {
  Injectable
} from '@angular/core';

import {
  RegisteredUser
} from '../models/registered-user.model';

import {
  UserRepository
} from '../repositories/user.repository';


@Injectable()
export class MockUserRepository
  extends UserRepository {


  private readonly users:
    RegisteredUser[] = [

      {
        id: 1,
        name: 'John Doe',
        username: 'johnd',
        email: 'john@email.com',
        phone: '555-0102'
      },

      {
        id: 2,
        name: 'Maria Lopez',
        username: 'mlopez',
        email: 'maria@email.com',
        phone: '555-0177'
      },

      {
        id: 3,
        name: 'Robert Smith',
        username: 'rsmith',
        email: 'robert@email.com',
        phone: '555-0144'
      }

    ];


  async getUsers():
    Promise<RegisteredUser[]> {

    await this.simulateDelay(
      650
    );


    if (!navigator.onLine) {

      throw new Error(
        'NETWORK_ERROR'
      );

    }


    return this.users.map(
      user => ({
        ...user
      })
    );

  }


  private async simulateDelay(
    milliseconds: number
  ): Promise<void> {

    await new Promise<void>(
      resolve => {

        setTimeout(
          resolve,
          milliseconds
        );

      }
    );

  }

}