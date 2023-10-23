import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (error) => {
      console.log(`Redis Client Error: ${error.message}`);
    });
    this.client.on('connect', () => {
      console.log('Redis client connected on port 6379');
    });
    this.getClient = promisify(this.client.get).bind(this.client);
  }

  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  async get(key) {
    const value = await this.getClient(key);
    return value;
  }

  async set(key, value, duration) {
    const set_key = await promisify(this.client.set).bind(this.client);
    await set_key(key, value);
    await this.client.expire(key, duration);
  }

  async del(key) {
    const del_key = await this.client.del(key);
    return del_key;
  }
}
const redisClient = new RedisClient();
export default redisClient;