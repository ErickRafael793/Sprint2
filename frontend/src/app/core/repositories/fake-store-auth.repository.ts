import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

import {
  firstValueFrom
} from 'rxjs';

import {
  AuthRepository
} from './auth.repository';

import {
  LoginResult
} from '../models/login-result.model';

import {
  FakeStoreUser
} from '../models/fake-store-user.model';


interface FakeStoreLoginResponse {

  token: string;

}


@Injectable()
export class FakeStoreAuthRepository
  extends AuthRepository {


  private readonly http =
    inject(HttpClient);


  private readonly baseUrl =
    'https://fakestoreapi.com';


  async login(
    username: string,
    password: string
  ): Promise<LoginResult> {

    try {

      /*
       * 1. Autenticar credenciales.
       */
      const authResponse =
        await firstValueFrom(

          this.http.post<FakeStoreLoginResponse>(
            `${this.baseUrl}/auth/login`,
            {
              username,
              password
            }
          )

        );


      /*
       * 2. FakeStore solamente devuelve
       *    el token en /auth/login.
       *
       * Necesitamos recuperar los usuarios
       * para conocer id, nombre, email, etc.
       */
      const users =
        await firstValueFrom(

          this.http.get<FakeStoreUser[]>(
            `${this.baseUrl}/users`
          )

        );


      const user =
        users.find(
          current =>
            current.username ===
            username
        );


      if (!user) {

        return {
          success: false,
          error: 'server'
        };

      }


      return {

        success: true,

        token:
          authResponse.token,

        user

      };


    } catch (
      error: unknown
    ) {


      if (
        error instanceof
        HttpErrorResponse
      ) {


        /*
         * Sin Internet / API inaccesible.
         */
        if (error.status === 0) {

          return {
            success: false,
            error: 'network'
          };

        }


        /*
         * Credenciales rechazadas.
         */
        if (
          error.status === 400 ||
          error.status === 401 ||
          error.status === 403
        ) {

          return {
            success: false,
            error:
              'invalid-credentials'
          };

        }

      }


      return {
        success: false,
        error: 'server'
      };

    }

  }

}