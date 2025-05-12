export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface UserPayload {
  id: number;
  role: UserRole;
}