import {
  UserSession
} from '../models/user-session.model';


export abstract class SessionRepository {

  abstract getCurrentSession():
    Promise<UserSession | null>;


  abstract saveSession(
    session: UserSession,
    token: string
  ): Promise<void>;


  abstract clearSession():
    Promise<void>;


  abstract getToken():
    string | null;

}