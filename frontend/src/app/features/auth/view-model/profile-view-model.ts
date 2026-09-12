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
  SessionRepository
} from '../../../core/repositories/session.repository';

import {
  CartRepository
} from '../../../core/repositories/cart.repository';

import {
  UserSession
} from '../../../core/models/user-session.model';


@Injectable()
export class ProfileViewModel {

  private readonly sessionRepository =
    inject(SessionRepository);


  private readonly cartRepository =
    inject(CartRepository);


  private readonly router =
    inject(Router);


  readonly session =
    signal<UserSession | null>(null);


  readonly loading =
    signal<boolean>(true);


  readonly showLogoutConfirmation =
    signal<boolean>(false);


  readonly loggingOut =
    signal<boolean>(false);


  readonly role = computed(
    () =>
      this.session()?.role ?? null
  );


  readonly isClient = computed(
    () =>
      this.role() === 'CLIENTE'
  );


  readonly isAdmin = computed(
    () =>
      this.role() === 'ADMIN'
  );


  readonly isAuditor = computed(
    () =>
      this.role() === 'AUDITOR'
  );


  readonly initials = computed(() => {

    const user =
      this.session();


    if (!user) {

      return '';

    }


    return user.name
      .split(' ')
      .filter(
        word =>
          word.length > 0
      )
      .map(
        word =>
          word.charAt(0)
      )
      .slice(0, 2)
      .join('')
      .toUpperCase();

  });


  async loadSession():
    Promise<void> {

    this.loading.set(
      true
    );


    try {

      const session =
        await this.sessionRepository
          .getCurrentSession();


      this.session.set(
        session
      );


      if (!session) {

        await this.router.navigate(
          ['/login'],
          {
            replaceUrl: true
          }
        );

      }

    } finally {

      this.loading.set(
        false
      );

    }

  }


  requestLogout(): void {

    this.showLogoutConfirmation.set(
      true
    );

  }


  cancelLogout(): void {

    if (
      this.loggingOut()
    ) {

      return;

    }


    this.showLogoutConfirmation.set(
      false
    );

  }


  /*
   * US02
   * Cierre de sesión y limpieza.
   */
  async logout():
    Promise<void> {

    if (
      this.loggingOut()
    ) {

      return;

    }


    this.loggingOut.set(
      true
    );


    try {

      /*
       * 1. Limpiar carrito local.
       */
      await this.cartRepository
        .clearCart();


      /*
       * 2. Eliminar sesión y token
       *    recibido de Fake Store API.
       */
      await this.sessionRepository
        .clearSession();


      /*
       * 3. Limpiar el estado
       *    del ViewModel.
       */
      this.session.set(
        null
      );


      this.showLogoutConfirmation.set(
        false
      );


      /*
       * 4. Volver al login.
       *
       * replaceUrl evita conservar
       * Perfil como la pantalla anterior.
       */
      await this.router.navigate(
        ['/login'],
        {
          queryParams: {
            logout: 'success'
          },

          replaceUrl: true
        }
      );

    } finally {

      this.loggingOut.set(
        false
      );

    }

  }

}