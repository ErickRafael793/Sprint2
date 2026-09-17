import {
  inject,
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  firstValueFrom
} from 'rxjs';

import {
  UserRepository
} from './user.repository';

import {
  RegisteredUser
} from '../models/registered-user.model';

import {
  FakeStoreUser
} from '../models/fake-store-user.model';


@Injectable()
export class FakeStoreUserRepository
  extends UserRepository {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    'https://fakestoreapi.com';


  async getUsers():
    Promise<RegisteredUser[]> {

    const users =
      await firstValueFrom(
        this.http.get<FakeStoreUser[]>(
          `${this.baseUrl}/users`
        )
      );


    return users.map(
      user => {

        const firstName =
          this.formatName(
            user.name?.firstname
          );

        const lastName =
          this.formatName(
            user.name?.lastname
          );


        return {
          id: user.id,

          name:
            `${firstName} ${lastName}`
              .trim() ||
            user.username,

          username:
            user.username ?? '',

          email:
            user.email ?? '',

          phone:
            user.phone ?? ''
        };

      }
    );
  }


  private formatName(
    value: string | undefined
  ): string {

    const normalized =
      value?.trim() ?? '';

    if (!normalized) {
      return '';
    }

    return (
      normalized.charAt(0)
        .toUpperCase() +
      normalized.slice(1)
    );
  }
}