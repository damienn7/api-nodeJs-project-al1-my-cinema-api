import request from 'supertest';
import { app } from '../../src/app';
import { AppDataSource } from '../../src/db/database';
import { Cinema } from '../../src/db/models/cinema';
import { setupTestUsers, tokens } from '../utils/setupTestUsers';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Cinema API', () => {
  const validCinema = {
    name: 'Salle 1',
    description: 'Une grande salle avec projecteur 3D',
    image: 'http://example.com/image.jpg',
    type: '3D',
    capacity: 25,
    isAccessible: true,
  };

  beforeEach(async () => {
    await setupTestUsers();
    await AppDataSource.getRepository(Cinema).createQueryBuilder().delete().execute();  
  });

  it('should allow ADMIN to create a cinema', async () => {
    const res = await request(app)
      .post('/cinemas')
      .set('Authorization', `Bearer ${tokens.ADMIN}`)
      .send(validCinema);
    // console.log(res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(validCinema.name);
  });

  it('should forbid USER from creating a cinema', async () => {
    const res = await request(app)
      .post('/cinemas')
      .set('Authorization', `Bearer ${tokens.USER}`)
      .send(validCinema);

    expect(res.status).toBe(403);
  });

  it('should reject invalid capacity', async () => {
    const res = await request(app)
      .post('/cinemas')
      .set('Authorization', `Bearer ${tokens.ADMIN}`)
      .send({ ...validCinema, capacity: 10 }); // invalid

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/capacity/i);
  });

  it('should allow USER to view all cinemas', async () => {
    await Cinema.create({...validCinema} as Cinema).save();

    const res = await request(app)
      .get('/cinemas')
      .set('Authorization', `Bearer ${tokens.USER}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name', validCinema.name);
  });

  it('should allow ADMIN to set a cinema in maintenance', async () => {
    const cinema = await Cinema.create({...validCinema} as Cinema).save();

    const res = await request(app)
      .patch(`/cinemas/${cinema.id}/maintenance`)
      .set('Authorization', `Bearer ${tokens.ADMIN}`);

    expect(res.status).toBe(200);

    const updated = await Cinema.findOneBy({ id: cinema.id });
    expect(updated?.status).toBe('MAINTENANCE');
  });

  it('should allow USER to see cinema schedule', async () => {
    const cinema = await Cinema.create({...validCinema} as Cinema).save();

    const res = await request(app)
      .get(`/cinemas/${cinema.id}/schedule?start=2024-01-01&end=2025-01-01`)
      .set('Authorization', `Bearer ${tokens.USER}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
