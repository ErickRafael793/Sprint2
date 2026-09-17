import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  SessionRepository
} from '../repositories/session.repository';


export const authGuard:
  CanActivateFn =
  async () => {

    const sessionRepository =
      inject(SessionRepository);


    const router =
      inject(Router);


    const session =
      await sessionRepository
        .getCurrentSession();


    const token =
      sessionRepository
        .getToken();


    if (
      session &&
      token
    ) {

      return true;

    }


    return router.createUrlTree([
      '/login'
    ]);

  };