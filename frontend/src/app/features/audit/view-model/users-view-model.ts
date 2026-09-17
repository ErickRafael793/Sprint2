import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  RegisteredUser
} from '../../../core/models/registered-user.model';

import {
  UserSession
} from '../../../core/models/user-session.model';

import {
  UserRepository
} from '../../../core/repositories/user.repository';

import {
  SessionRepository
} from '../../../core/repositories/session.repository';


export type UsersStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'error';


@Injectable()
export class UsersViewModel {

  private readonly userRepository =
    inject(UserRepository);

  private readonly sessionRepository =
    inject(SessionRepository);

  private readonly router =
    inject(Router);


  readonly users =
    signal<RegisteredUser[]>([]);


  readonly session =
    signal<UserSession | null>(null);


  readonly status =
    signal<UsersStatus>('idle');


  readonly isLoading = computed(
    () =>
      this.status() === 'loading'
  );


  readonly hasError = computed(
    () =>
      this.status() === 'error'
  );


  readonly canAccess =
  computed(
    () => {

      const role =
        this.session()?.role;

      return (
        role === 'ADMIN' ||
        role === 'AUDITOR'
      );
    }
  );


  async initialize(): Promise<void> {

    this.status.set(
      'loading'
    );


    try {

      /*
       * Primero verificamos
       * quién inició sesión.
       */
      const session =
        await this.sessionRepository
          .getCurrentSession();


      this.session.set(
        session
      );


      /*
       * Solo AUDITOR puede descargar
       * el directorio.
       */
      if (
          session?.role !== 'ADMIN' &&
          session?.role !== 'AUDITOR'
         ) {

        this.users.set(
          []
        );

        this.status.set(
          'ready'
        );

        return;

      }


      const users =
        await this.userRepository
          .getUsers();


      this.users.set(
        users
      );


      this.status.set(
        'ready'
      );

    } catch {

      this.users.set(
        []
      );


      this.status.set(
        'error'
      );

    }

  }


  async retry(): Promise<void> {

    await this.initialize();

  }


  goToCatalog(): void {

    this.router.navigate([
      '/catalog'
    ]);

  }

}