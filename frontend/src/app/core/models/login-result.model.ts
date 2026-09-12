import {
  FakeStoreUser
} from './fake-store-user.model';


export type LoginError =
  | 'invalid-credentials'
  | 'network'
  | 'server';


export interface LoginResult {

  success: boolean;

  token?: string;

  user?: FakeStoreUser;

  error?: LoginError;

}