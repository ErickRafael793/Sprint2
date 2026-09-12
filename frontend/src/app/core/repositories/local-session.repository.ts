import {
  Injectable
} from '@angular/core';

import {
  UserSession
} from '../models/user-session.model';

import {
  SessionRepository
} from './session.repository';


@Injectable()
export class LocalSessionRepository
  extends SessionRepository {


  private readonly sessionKey =
    'lino_session';


  private readonly tokenKey =
    'lino_token';


  async getCurrentSession():
    Promise<UserSession | null> {

    const storedSession =
      localStorage.getItem(
        this.sessionKey
      );


    if (!storedSession) {

      return null;

    }


    try {

      return JSON.parse(
        storedSession
      ) as UserSession;

    } catch {

      await this.clearSession();

      return null;

    }

  }


  async saveSession(
    session: UserSession,
    token: string
  ): Promise<void> {

    localStorage.setItem(
      this.sessionKey,
      JSON.stringify(
        session
      )
    );


    localStorage.setItem(
      this.tokenKey,
      token
    );

  }


  async clearSession():
    Promise<void> {

    localStorage.removeItem(
      this.sessionKey
    );


    localStorage.removeItem(
      this.tokenKey
    );

  }


  getToken():
    string | null {

    return localStorage.getItem(
      this.tokenKey
    );

  }

}