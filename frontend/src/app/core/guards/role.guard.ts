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

import {
  UserRole
} from '../models/user-session.model';


export const roleGuard:
  CanActivateFn =
  async route => {

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


    /*
     * Sin sesión válida:
     * regresar al login.
     */
    if (
      !session ||
      !token
    ) {

      return router
        .createUrlTree([
          '/login'
        ]);
    }


    const allowedRoles =
      route.data[
        'allowedRoles'
      ] as
        UserRole[] |
        undefined;


    /*
     * Si la ruta no definió roles,
     * permitimos continuar.
     */
    if (
      !allowedRoles
    ) {

      return true;
    }


    if (
      allowedRoles.includes(
        session.role
      )
    ) {

      return true;
    }


    /*
     * Tiene sesión,
     * pero no tiene permisos.
     */
    return router.createUrlTree(
      ['/catalog'],
      {
        queryParams: {
          accessDenied:
            'true'
        }
      }
    );
  };