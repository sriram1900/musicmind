const Redis = require('ioredis');

// Use environment variable for Redis URL or default to localhost
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

console.log(`[Cache] Connecting to Redis at ${REDIS_URL.split('@').pop()}`); // Log only host for security

const redis = new Redis(REDIS_URL, {
    lazyConnect: true,
    retryStrategy(times) {
        const delay = Math.min(times * 100, 2000);
        return delay;
    }
});

redis.on('error', (err) => {
    // Suppress heavy error logging if redis is just missing locally
    if (err.code === 'ECONNREFUSED') {
        console.warn('[Cache] Redis connection refused. Caching disabled.');
    } else {
        console.error('[Cache] Redis Error:', err.message);
    }
});

redis.on('connect', () => console.log('[Cache] Redis Connected'));

async function get(key) {
    if (redis.status !== 'ready') return null;
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null; // Fail safe
    }
}

async function set(key, value, ttlSeconds = 3600) {
    if (redis.status !== 'ready') return;
    try {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (e) {
        console.error('[Cache] Set Error:', e.message);
    }
}

async function del(key) {
    if (redis.status !== 'ready') return;
    try {
        await redis.del(key);
    } catch (e) {
        console.error('[Cache] Del Error:', e.message);
    }
}

module.exports = {
    get,
    set,
    del,
    redis
};
