const request = require('supertest');
const app = require('../src/app');
const { setupDB } = require('./../tests/fixtures/test-setup');

setupDB();

let token;
let communityID, postID, commentID;

beforeEach(async () => {
  const response = await request(app).post('/api/v1/users/signin').send({
    email: '1@noddit.com',
    password: 'noddit123',
  });
  token = response.body[`token`];

  const response2 = await request(app)
    .post('/api/v1/communities')
    .set('Authorization', 'Bearer ' + token)
    .send({
      name: 'noddit_community',
      description: 'A noddit community',
    });

  communityID = response2.body.data.community._id;

  const response3 = await request(app)
    .post('/api/v1/posts')
    .set('Authorization', 'Bearer ' + token)
    .send({
      title: 'A post',
      description: 'This is a post!',
      mediaURLs: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
      community: communityID,
    });

  postID = response3.body.data.document._id;

  const response4 = await request(app)
    .post('/api/v1/comments/')
    .set('Authorization', 'Bearer ' + token)
    .send({
      parent: postID,
      content: 'This is a comment!',
    });

  commentID = response4.body.data.document._id;
});

test('Should upvote the comment', async () => {
  const response = await request(app)
    .post('/api/v1/comments/' + commentID + '/upvote')
    .set('Authorization', 'Bearer ' + token)
    .send();

  expect(response.statusCode).toBe(200);
});

test('Should downvote the comment', async () => {
  const response = await request(app)
    .post('/api/v1/comments/' + commentID + '/downvote')
    .set('Authorization', 'Bearer ' + token)
    .send();

  expect(response.statusCode).toBe(200);
});

test('Should remove upvote from the comment', async () => {
  await request(app)
    .post('/api/v1/comments/' + commentID + '/upvote')
    .set('Authorization', 'Bearer ' + token)
    .send();

  const response = await request(app)
    .delete('/api/v1/comments/' + commentID + '/upvote')
    .set('Authorization', 'Bearer ' + token)
    .send();

  expect(response.statusCode).toBe(200);
});

test('Should remove downvote from the comment', async () => {
  await request(app)
    .post('/api/v1/comments/' + commentID + '/downvote')
    .set('Authorization', 'Bearer ' + token)
    .send();

  const response = await request(app)
    .delete('/api/v1/comments/' + commentID + '/downvote')
    .set('Authorization', 'Bearer ' + token)
    .send();

  expect(response.statusCode).toBe(200);
});

test('Should delete the comment', async () => {
  const response = await request(app)
    .delete('/api/v1/comments/' + commentID)
    .set('Authorization', 'Bearer ' + token)
    .send();

  expect(response.statusCode).toBe(204);
});

test('Should reply to the comment', async () => {
  const response = await request(app)
    .post('/api/v1/comments/')
    .set('Authorization', 'Bearer ' + token)
    .send({
      parent: commentID,
      content: 'This is a reply!',
    });

  expect(response.statusCode).toBe(201);
});
