const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) {
      return null;
    }
    return Math.min(times * 100, 3000);
  }
});

redis.on('connect', () => {
  console.log('Redis connecté');
});

redis.on('error', (err) => {
  console.error('Erreur Redis:', err);
});

module.exports = redis;