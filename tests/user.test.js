const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');

const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

afterEach(async () => {
  await removeAllCollections();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/api/v1/users/signup')
    .send({
      username: 'testuser',
      email: 'user@test.com',
      password: 'noddit123',
    })
    .expect(201);

  // // Assert that the database was changed correctly
  const user = await User.findById(response.body.data.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body.data.user.username).toBe('testuser');
});
