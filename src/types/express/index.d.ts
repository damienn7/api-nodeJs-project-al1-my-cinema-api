import { Request } from 'express';
import { UserRole } from '../user';

export interface UserAuthRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  };
}
