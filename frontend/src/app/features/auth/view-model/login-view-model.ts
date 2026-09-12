import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  AuthRepository
} from '../../../core/repositories/auth.repository';

import {
  SessionRepository
} from '../../../core/repositories/session.repository';

import {
  UserRoleResolverService
} from '../../../core/services/user-role-resolver.service';

import {
  UserSession
} from '../../../core/models/user-session.model';


export type LoginStatus =
  | 'idle'
  | 'loading'
  | 'invalid'
  | 'offline'
  | 'error'
  | 'success';


@Injectable()
export class LoginViewModel {

  private readonly authRepository =
    inject(AuthRepository);


  private readonly sessionRepository =
    inject(SessionRepository);


  private readonly roleResolver =
    inject(UserRoleResolverService);


  private readonly router =
    inject(Router);


  private readonly route =
    inject(ActivatedRoute);


  readonly username =
    signal('johnd');


  readonly password =
    signal('');


  readonly status =
    signal<LoginStatus>('idle');


  readonly logoutSuccess =
    signal(false);


  readonly isLoading = computed(
    () =>
      this.status() === 'loading'
  );


  readonly hasInvalidCredentials = computed(
    () =>
      this.status() === 'invalid'
  );


  readonly isOffline = computed(
    () =>
      this.status() === 'offline'
  );


  readonly hasError = computed(
    () =>
      this.status() === 'error'
  );


  initialize(): void {

    const logout =
      this.route.snapshot
        .queryParamMap
        .get('logout');


    this.logoutSuccess.set(
      logout === 'success'
    );

  }


  setUsername(
    value: string
  ): void {

    this.username.set(
      value
    );


    if (
      this.status() !== 'loading'
    ) {

      this.status.set(
        'idle'
      );

    }

  }


  setPassword(
    value: string
  ): void {

    this.password.set(
      value
    );


    if (
      this.status() !== 'loading'
    ) {

      this.status.set(
        'idle'
      );

    }

  }


  async login():
    Promise<void> {

    /*
     * Evitar múltiples peticiones
     * mientras ya estamos iniciando sesión.
     */
    if (
      this.status() === 'loading'
    ) {

      return;

    }


    const username =
      this.username().trim();


    const password =
      this.password();


    /*
     * Validación local básica.
     */
    if (
      username === '' ||
      password === ''
    ) {

      this.status.set(
        'invalid'
      );

      return;

    }


    this.status.set(
      'loading'
    );


    try {

      /*
       * =========================
       * FAKE STORE API
       * =========================
       *
       * El ViewModel no sabe cómo
       * funciona HttpClient.
       *
       * Solo conoce AuthRepository.
       */
      const result =
        await this.authRepository
          .login(
            username,
            password
          );


      /*
       * =========================
       * ERROR DE LOGIN
       * =========================
       */
      if (!result.success) {


        if (
          result.error ===
          'network'
        ) {

          this.status.set(
            'offline'
          );

          return;

        }


        if (
          result.error ===
          'invalid-credentials'
        ) {

          this.status.set(
            'invalid'
          );

          return;

        }


        this.status.set(
          'error'
        );

        return;

      }


      /*
       * Una respuesta exitosa debe
       * contener token y usuario.
       */
      if (
        !result.token ||
        !result.user
      ) {

        this.status.set(
          'error'
        );

        return;

      }


      /*
       * =========================
       * ROL LOCAL
       * =========================
       *
       * FakeStore no maneja nuestros
       * roles CLIENTE / ADMIN / AUDITOR.
       *
       * Por eso los resolvemos mediante
       * nuestro servicio independiente.
       */
     const role =
  this.roleResolver.resolve(
    result.user.id
  );


      /*
       * =========================
       * CREAR SESIÓN
       * =========================
       */
      const session:
        UserSession = {

          id:
            result.user.id,

          name:
            `${result.user.name.firstname} ${result.user.name.lastname}`,

          username:
            result.user.username,

          email:
            result.user.email,

          role,

          cartItems: 0,

          active: true

        };


      /*
       * =========================
       * GUARDAR TOKEN + SESIÓN
       * =========================
       */
      await this.sessionRepository
        .saveSession(
          session,
          result.token
        );


      this.status.set(
        'success'
      );


      /*
       * Ya existe una sesión real.
       */
      await this.router.navigate([
        '/catalog'
      ]);


    } catch {

      /*
       * Protección ante un error
       * inesperado fuera del Repository.
       */
      this.status.set(
        'error'
      );

    }

  }

}