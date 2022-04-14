const mongoose = require('mongoose');
const User = require('./../../src/models/userModel');

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

const users = [
  {
    username: 'nodditor1',
    email: '1@noddit.com',
    password: 'noddit123',
    role: 'user',
    karma: 50,
  },
  {
    username: 'nodditor2',
    email: '2@noddit.com',
    password: 'noddit123',
    role: 'user',
  },
  {
    username: 'nodditor3',
    email: '3@noddit.com',
    password: 'noddit123',
    role: 'user',
  },
];

module.exports = {
  setupDB() {
    // Connect to Mongoose
    beforeAll(async () => {
      await mongoose.connect(process.env.MONGO_URL);
    });
    //mongoexport --db <databaseName> --collection <collectionName> --jsonArray --pretty --out output.json

    // Seed the database with users
    beforeEach(async () => {
      await User.create(users);
    });

    // Cleans up database between each test
    afterEach(async () => {
      await removeAllCollections();
    });

    // Disconnect mongooose
    afterAll(async () => {
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
    });
  },
};
