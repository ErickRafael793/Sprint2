import { LoginResult } from '../models/login-result.model';

export abstract class AuthRepository {
  abstract login(
    username: string,
    password: string
  ): Promise<LoginResult>;
} 