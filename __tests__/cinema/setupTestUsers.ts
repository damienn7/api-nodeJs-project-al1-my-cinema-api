import request from 'supertest';
import { app } from '../../src/main';
import { AppDataSource } from '../../src/db/database';
import { User } from '../../src/db/models/user';
import { Token } from '../../src/db/models/token';

export const users = {
  USER: { email: 'user@test.com', password: 'user123', role: 'USER' },
  ADMIN: { email: 'admin@test.com', password: 'admin123', role: 'ADMIN' },
  SUPER_ADMIN: { email: 'super@test.com', password: 'super123', role: 'SUPER_ADMIN' },
};

export const tokens: Record<string, string> = {};

export const setupTestUsers = async () => {

  await AppDataSource.getRepository(Token).delete({});
  await AppDataSource.getRepository(User).delete({});

  for (const { email, password } of Object.values(users)) {
    await request(app).post('/auth/register').send({ email, password });
  }

  await AppDataSource.getRepository(User).update(
    { email: users.ADMIN.email },
    { role: 'ADMIN' }
  );
  await AppDataSource.getRepository(User).update(
    { email: users.SUPER_ADMIN.email },
    { role: 'SUPER_ADMIN' }
  );

  for (const [key, { email, password }] of Object.entries(users)) {
    const res = await request(app).post('/auth/login').send({ email, password });
    tokens[key] = res.body.accessToken;
  }
};
