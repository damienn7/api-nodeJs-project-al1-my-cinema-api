import { Application, Request, Response } from 'express';
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from './validators/auth/auth.schema';
import { validateAuthBody, authMiddleware, authRoles } from '../middleware/auth';
import { login } from './auth.login';
import { register } from './auth.register';
import { refresh } from './auth.refresh';
import { logoutAll } from './auth.logout-all';
import { logout } from './auth.logout';
import { getUsers } from './user.get-all';
import { deleteMyAccount } from './user.delete';

export const initHandlers = (app: Application) => {
    app.get("/test", (request: Request, response: Response) => {
        response.send({"message": "Hello Olleh !"})
    });

    app.post('/auth/register', validateAuthBody(registerSchema), register);
    
    app.post('/auth/login', validateAuthBody(loginSchema), login);

    app.post('/auth/refresh', validateAuthBody(refreshSchema), refresh);

    app.post('/auth/logout', validateAuthBody(logoutSchema), logout);

    app.post('/auth/logout-all', authMiddleware, logoutAll);

    app.get('/admin/users', authMiddleware, authRoles('ADMIN', 'SUPER_ADMIN'), getUsers);

    app.delete('/me', authMiddleware, deleteMyAccount);

};