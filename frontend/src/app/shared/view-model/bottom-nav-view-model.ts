import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  UserSession
} from '../../core/models/user-session.model';

import {
  SessionRepository
} from '../../core/repositories/session.repository';


@Injectable()
export class BottomNavViewModel {

  private readonly sessionRepository =
    inject(SessionRepository);


  readonly session =
    signal<UserSession | null>(null);


  readonly loading =
    signal<boolean>(true);


  readonly role =
    computed(
      () =>
        this.session()?.role ??
        null
    );


  readonly isClient =
    computed(
      () =>
        this.role() === 'CLIENTE'
    );


  readonly isAdmin =
    computed(
      () =>
        this.role() === 'ADMIN'
    );


  readonly isAuditor =
    computed(
      () =>
        this.role() === 'AUDITOR'
    );

  readonly canAudit =
   computed(
    () =>
      this.role() === 'ADMIN' ||
      this.role() === 'AUDITOR'
  );

  async initialize():
    Promise<void> {

    this.loading.set(
      true
    );


    try {

      const currentSession =
        await this.sessionRepository
          .getCurrentSession();


      this.session.set(
        currentSession
      );

    } finally {

      this.loading.set(
        false
      );

    }

  }

}