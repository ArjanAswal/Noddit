const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const { setupDB } = require('./../tests/fixtures/test-setup');

setupDB();

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/api/v1/users/signup')
    .send({
      username: 'testuser',
      email: 'user@test.com',
      password: 'noddit123',
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.data.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body.data.user.username).toBe('testuser');
});

test('Should not signup a new user with invalid username', async () => {
  await request(app)
    .post('/api/v1/users/signup')
    .send({
      username: 'test user',
      email: 'user@test.com',
      password: 'noddit123',
    })
    .expect(400);
});

test('Should signin existing user', async () => {
  const response = await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: '1@noddit.com',
      password: 'noddit123',
    })
    .expect(200);

  expect(response.body.data.user.username).toBe('nodditor1');
});

test('Should not signin invalid user', async () => {
  const response = await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: '1@noddit.com',
      password: 'noddit1234',
    })
    .expect(401);

  expect(response.text).toBe('Unauthorized');
});

test('Should signout existing user', async () => {
  await request(app).post('/api/v1/users/signin').send({
    email: '1@noddit.com',
    password: 'noddit123',
  });

  await request(app).get('/api/v1/users/signout').send().expect(200);
});

test('Should update password of existing user', async () => {
  const response = await request(app).post('/api/v1/users/signin').send({
    email: '1@noddit.com',
    password: 'noddit123',
  });

  let { token } = response.body;

  await request(app)
    .patch('/api/v1/users/updatePassword')
    .set('Authorization', 'Bearer ' + token)
    .send({
      currentPassword: 'noddit123',
      password: 'newPassword',
    })
    .expect(200);

  await request(app).get('/api/v1/users/signout').send().expect(200);

  await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: '1@noddit.com',
      password: 'newPassword',
    })
    .expect(200);
});
