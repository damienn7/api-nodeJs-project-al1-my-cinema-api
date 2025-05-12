import request from 'supertest';
import { app } from '../../src/main';
import { AppDataSource } from '../../src/db/database';
import { User } from '../../src/db/models/user';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Auth API', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'TestPassword123';

  afterEach(async () => {
    await User.delete({ email: testEmail });
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Registration successful.');
  });

  it('should not register an existing user', async () => {
    // First registration
    await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    // Try again
    const res = await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('User already exists.');
  });

  it('should login a user and return tokens', async () => {
    // Register first
    await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should not login with unknown email', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'doesnotexist@example.com',
      password: testPassword,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials..');
  });

  it('should not login with incorrect password', async () => {
    await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: 'WrongPassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials..');
  });

  it('should refresh access token with valid refresh token', async () => {
    const registerRes = await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    const refreshToken = loginRes.body.refreshToken;

    const res = await request(app).post('/auth/refresh').send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should logout a user by deleting refresh token', async () => {
    const registerRes = await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
    });
    
    const loginRes = await request(app).post('/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    const refreshToken = loginRes.body.refreshToken;

    // console.log('refreshToken', loginRes.body);

    const res = await request(app).post('/auth/logout').send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully.');
  });


});
