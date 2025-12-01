import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL!;

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
});

redis.on('error', (err) => {
    console.warn('Redis connection error:', err);
});

redis.on('connect', () => {
    console.log('Redis connected');
});

export default redis;
