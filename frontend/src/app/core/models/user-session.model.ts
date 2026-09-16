export type UserRole =
  | 'CLIENTE'
  | 'ADMIN'
  | 'AUDITOR';

export interface UserSession {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  cartItems: number;
  active: boolean;
}