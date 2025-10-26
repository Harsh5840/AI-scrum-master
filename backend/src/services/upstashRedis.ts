import axios from 'axios';

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Create axios instance for Upstash REST API
const upstashClient = axios.create({
  baseURL: UPSTASH_REDIS_REST_URL || '',
  headers: {
    'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export class UpstashRedis {
  private async makeRequest(command: string, args: any[] = []): Promise<any> {
    try {
      const response = await upstashClient.post('/', {
        [command]: args
      });
      return response.data.result;
    } catch (error) {
      console.error('Upstash Redis error:', error);
      throw error;
    }
  }

  // Basic Redis operations
  async get(key: string): Promise<string | null> {
    return await this.makeRequest('GET', [key]);
  }

  async set(key: string, value: string, options?: { ex?: number }): Promise<string> {
    const args = [key, value];
    if (options?.ex) {
      args.push('EX', options.ex.toString());
    }
    return await this.makeRequest('SET', args);
  }

  async del(key: string): Promise<number> {
    return await this.makeRequest('DEL', [key]);
  }

  async exists(key: string): Promise<number> {
    return await this.makeRequest('EXISTS', [key]);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.makeRequest('EXPIRE', [key, seconds]);
  }

  async ttl(key: string): Promise<number> {
    return await this.makeRequest('TTL', [key]);
  }

  // Hash operations
  async hget(hash: string, field: string): Promise<string | null> {
    return await this.makeRequest('HGET', [hash, field]);
  }

  async hset(hash: string, field: string, value: string): Promise<number> {
    return await this.makeRequest('HSET', [hash, field, value]);
  }

  async hgetall(hash: string): Promise<Record<string, string>> {
    const result = await this.makeRequest('HGETALL', [hash]);
    const obj: Record<string, string> = {};
    for (let i = 0; i < result.length; i += 2) {
      obj[result[i]] = result[i + 1];
    }
    return obj;
  }

  async hdel(hash: string, field: string): Promise<number> {
    return await this.makeRequest('HDEL', [hash, field]);
  }

  // List operations
  async lpush(key: string, value: string): Promise<number> {
    return await this.makeRequest('LPUSH', [key, value]);
  }

  async rpush(key: string, value: string): Promise<number> {
    return await this.makeRequest('RPUSH', [key, value]);
  }

  async lpop(key: string): Promise<string | null> {
    return await this.makeRequest('LPOP', [key]);
  }

  async rpop(key: string): Promise<string | null> {
    return await this.makeRequest('RPOP', [key]);
  }

  async llen(key: string): Promise<number> {
    return await this.makeRequest('LLEN', [key]);
  }

  // Set operations
  async sadd(key: string, member: string): Promise<number> {
    return await this.makeRequest('SADD', [key, member]);
  }

  async srem(key: string, member: string): Promise<number> {
    return await this.makeRequest('SREM', [key, member]);
  }

  async smembers(key: string): Promise<string[]> {
    return await this.makeRequest('SMEMBERS', [key]);
  }

  async sismember(key: string, member: string): Promise<number> {
    return await this.makeRequest('SISMEMBER', [key, member]);
  }

  // Connection methods (no-op for REST API)
  async connect(): Promise<void> {
    // REST API doesn't need explicit connection
  }

  async disconnect(): Promise<void> {
    // REST API doesn't need explicit disconnection
  }

  async ping(): Promise<string> {
    return await this.makeRequest('PING', []);
  }
}

// Export singleton instance
export const upstashRedis = new UpstashRedis();