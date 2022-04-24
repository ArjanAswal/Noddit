const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = process.env.REDIS_URL;
const client = redis.createClient({
  url : redisUrl,
  legacyMode : true,
});

client.hGet = util.promisify(client.hGet);
const {exec} = mongoose.Query.prototype;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key ?? '');
  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(Object.assign(this._conditions, this.options));

  const cacheValue = await client.hGet(this.hashKey, key);

  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc) ? doc.map((d) => new this.model(d))
                              : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  client.hSet(this.hashKey, key, JSON.stringify(result), 'EX', 10);
  return result;
};

module.exports = {
  clearHash(hashKey) { client.del(JSON.stringify(hashKey)); },
  async connectRedis() { await client.connect(); },
  clearCache(cacheKey) { client.del(JSON.stringify(cacheKey)); },
};
