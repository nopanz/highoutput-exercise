/* eslint-disable no-console */
import redis from 'redis';
import { promisify } from 'util';
import { REDIS_HOST } from '@config/server';

class Redis {
  private static instance: Redis

  private redisClient = redis.createClient({ host: REDIS_HOST });

  static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
      Redis.instance.redisClient.on('connect', () => {
        console.log('redis is ready');
      });
      Redis.instance.redisClient.on('reconnecting', () => {
        console.log('reconnecting redis');
      });
      Redis.instance.redisClient.on('error', (err) => {
        console.error('redis error', err);
      });
    }
    return Redis.instance;
  }

  async get(key: string) {
    const getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    return getAsync(key);
  }

  async set(key: string, value: string) {
    return this.redisClient.set(key, value, 'EX', 60 * 60 * 24);
  }

  async quit() {
    const quitAsync = promisify(this.redisClient.quit).bind(this.redisClient);
    return quitAsync();
  }
}


export default Redis.getInstance();
