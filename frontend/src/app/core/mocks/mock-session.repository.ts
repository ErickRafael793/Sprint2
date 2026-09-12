/**import {
  Injectable
} from '@angular/core';

import {
  UserSession
} from '../models/user-session.model';

import {
  SessionRepository
} from '../repositories/session.repository';


@Injectable()
export class MockSessionRepository
  extends SessionRepository {


  private currentSession:
    UserSession | null = {

      id: 1,

      name: 'John Doe',

      username: 'johnd',

      email: 'johnd@email.com',

      role: 'CLIENTE',

      cartItems: 0,

      active: true

    };


  private token:
    string | null =
      'mock-token';


  async getCurrentSession():
    Promise<UserSession | null> {

    if (!this.currentSession) {

      return null;

    }


    return {
      ...this.currentSession
    };

  }


  async saveSession(
    session: UserSession,
    token: string
  ): Promise<void> {

    this.currentSession = {
      ...session
    };


    this.token =
      token;

  }


  async clearSession():
    Promise<void> {

    this.currentSession =
      null;


    this.token =
      null;

  }


  getToken():
    string | null {

    return this.token;

  }

}*/