import request from 'supertest';
import { app } from '../../src/main';
import { AppDataSource } from '../../src/db/database';
import { User } from '../../src/db/models/user';
import { Token } from '../../src/db/models/token';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Role-based access control', () => {
  const users = {
    USER: { email: 'user@test.com', password: 'user123', role: 'USER' },
    ADMIN: { email: 'admin@test.com', password: 'admin123', role: 'ADMIN' },
    SUPER_ADMIN: { email: 'super@test.com', password: 'super123', role: 'SUPER_ADMIN' }
  };

  beforeEach(async () => {

    await AppDataSource.getRepository(Token).createQueryBuilder().delete().execute();
    await AppDataSource.getRepository(User).createQueryBuilder().delete().execute();

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
  });

  it('should forbid USER to access /admin/users', async () => {
    const loginRes = await request(app).post('/auth/login').send(users.USER);
    const token = loginRes.body.accessToken;
    // console.log(loginRes.body);
    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`);
    // console.log(res.message);
    expect(res.status).toBe(403);
  });

  it('should allow ADMIN to access /admin/users', async () => {
    const loginRes = await request(app).post('/auth/login').send(users.ADMIN);
    const token = loginRes.body.accessToken;

    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should allow SUPER_ADMIN to access /admin/users', async () => {
    const loginRes = await request(app).post('/auth/login').send(users.SUPER_ADMIN);
    const token = loginRes.body.accessToken;

    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should allow any connected user to delete their own account', async () => {
    const loginRes = await request(app).post('/auth/login').send(users.USER);
    const token = loginRes.body.accessToken;

    const res = await request(app)
      .delete('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Account deleted successfully.');
  });
});
