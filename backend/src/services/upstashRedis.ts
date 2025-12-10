import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.warn('⚠️ Upstash Redis credentials missing in .env file');
}

// Initialize Upstash Redis client
const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL || '',
  token: UPSTASH_REDIS_REST_TOKEN || '',
});

export class UpstashRedisWrapper {
  // Basic Redis operations
  async get(key: string): Promise<string | null> {
    return await redis.get(key);
  }

  async set(key: string, value: string, options?: { ex?: number }): Promise<string | null> {
    if (options?.ex) {
      return await redis.set(key, value, { ex: options.ex });
    }
    return await redis.set(key, value);
  }

  async del(key: string): Promise<number> {
    return await redis.del(key);
  }

  async exists(key: string): Promise<number> {
    return await redis.exists(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await redis.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return await redis.ttl(key);
  }

  // Hash operations
  async hget(hash: string, field: string): Promise<string | null> {
    return await redis.hget(hash, field);
  }

  async hset(hash: string, field: string, value: string): Promise<number> {
    return await redis.hset(hash, { [field]: value });
  }

  async hgetall(hash: string): Promise<Record<string, string> | null> {
    return await redis.hgetall(hash);
  }

  async hdel(hash: string, field: string): Promise<number> {
    return await redis.hdel(hash, field);
  }

  // List operations
  async lpush(key: string, value: string): Promise<number> {
    return await redis.lpush(key, value);
  }

  async rpush(key: string, value: string): Promise<number> {
    return await redis.rpush(key, value);
  }

  async lpop(key: string): Promise<string | null> {
    return await redis.lpop(key);
  }

  async rpop(key: string): Promise<string | null> {
    return await redis.rpop(key);
  }

  async llen(key: string): Promise<number> {
    return await redis.llen(key);
  }

  // Set operations
  async sadd(key: string, member: string): Promise<number> {
    return await redis.sadd(key, member);
  }

  async srem(key: string, member: string): Promise<number> {
    return await redis.srem(key, member);
  }

  async smembers(key: string): Promise<string[]> {
    return await redis.smembers(key);
  }

  async sismember(key: string, member: string): Promise<number> {
    return await redis.sismember(key, member);
  }

  // Connection methods (no-op for REST API)
  async connect(): Promise<void> {
    // REST API doesn't need explicit connection
  }

  async disconnect(): Promise<void> {
    // REST API doesn't need explicit disconnection
  }

  async ping(): Promise<string> {
    return await redis.ping();
  }
}

// Export singleton instance
export const upstashRedis = new UpstashRedisWrapper();