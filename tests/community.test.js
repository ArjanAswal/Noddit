const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const { setupDB } = require('./../tests/fixtures/test-setup');

setupDB();

let token;
let communityID;

beforeEach(async () => {
  const response = await request(app).post('/api/v1/users/signin').send({
    email: '1@noddit.com',
    password: 'noddit123',
  });
  token = response.body.token;

  const response2 = await request(app)
    .post('/api/v1/communities')
    .set('Authorization', 'Bearer ' + token)
    .send({
      name: 'noddit_community',
      description: 'A noddit community',
    });

  communityID = response2.body.data.community._id;
});

test('Should update a new community', async () => {
  const response = await request(app)
    .patch('/api/v1/communities/' + communityID)
    .set('Authorization', 'Bearer ' + token)
    .send({
      name: 'noddit_community_updated',
    });

  expect(response.statusCode).toBe(200);
});

test('Should ban user from community', async () => {
  const user = await User.findOne({ username: 'nodditor2' });

  const response = await request(app)
    .patch('/api/v1/communities/' + communityID + '/ban')
    .set('Authorization', 'Bearer ' + token)
    .send({
      user: user._id,
    });

  expect(response.statusCode).toBe(200);
});

test('Banned user should not be able to post', async () => {
  const user = await User.findOne({ username: 'nodditor2' });

  let response = await request(app)
    .patch('/api/v1/communities/' + communityID + '/ban')
    .set('Authorization', 'Bearer ' + token)
    .send({
      user: user._id,
    });

  response = await request(app).post('/api/v1/users/signin').send({
    email: '2@noddit.com',
    password: 'noddit123',
  });

  token = response.body.token;

  response = await request(app)
    .post('/api/v1/posts/')
    .set('Authorization', 'Bearer ' + token)
    .send({
      title: 'post',
      description: 'a description',
      community: communityID,
    });

  expect(response.statusCode).toBe(403);
});
