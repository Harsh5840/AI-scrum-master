import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { upstashRedis } from './src/services/upstashRedis.js';
import dotenv from 'dotenv';

dotenv.config();

async function testVectorService() {
  console.log('\n--- Testing Vector Service (Gemini) ---');
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY || '',
      modelName: 'text-embedding-004',
    });

    const text = "Hello, this is a test for Gemini embeddings.";
    const vector = await embeddings.embedQuery(text);
    
    if (vector && vector.length > 0) {
      console.log(`✅ Vector embedding generated successfully! Length: ${vector.length}`);
    } else {
      console.error('❌ Vector embedding generation failed: Empty vector returned.');
    }
  } catch (error) {
    console.error('❌ Vector Service Error:', error);
  }
}

async function testUpstashRest() {
  console.log('\n--- Testing Upstash Redis (REST API) ---');
  try {
    const key = 'test-key-' + Date.now();
    const value = 'test-value-' + Date.now();
    
    console.log(`Setting key: ${key}`);
    await upstashRedis.set(key, value);
    
    const retrieved = await upstashRedis.get(key);
    console.log(`Retrieved value: ${retrieved}`);
    
    if (retrieved === value) {
      console.log('✅ Upstash REST API connection successful!');
      await upstashRedis.del(key);
    } else {
      console.error('❌ Upstash REST API failed: Value mismatch.');
    }
  } catch (error) {
    console.error('❌ Upstash REST API Error:', error);
  }
}

async function testRedisAndBullMQ() {
  console.log('\n--- Testing Redis (TCP) & BullMQ ---');
  
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  console.log(`Connecting to Redis at: ${redisUrl}`);

  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
      if (times > 3) {
        return null; // Stop retrying after 3 attempts
      }
      return Math.min(times * 50, 2000);
    }
  });

  connection.on('error', (err) => {
    // Suppress unhandled error events to prevent crash
    // console.error('Redis Client Error:', err.message);
  });

  try {
    await connection.ping();
    console.log('✅ Redis TCP connection successful (PING/PONG)');
  } catch (error) {
    console.error('❌ Redis TCP Connection Error: Could not connect to Redis.');
    console.log('   Reason:', (error as any).message);
    console.log('⚠️  BullMQ requires a standard Redis connection (TCP).');
    console.log('   If you are using Upstash, go to your dashboard and copy the "Redis URL" (starts with rediss://).');
    console.log('   Then update REDIS_URL in your backend/.env file.');
    
    // Close connection to prevent hanging
    connection.disconnect();
    return;
  }

  try {
    const queueName = 'test-queue';
    const queue = new Queue(queueName, { connection });
    
    const job = await queue.add('test-job', { message: 'Hello BullMQ' });
    console.log(`✅ Job added to queue: ${job.id}`);

    const worker = new Worker(queueName, async job => {
      console.log(`⚙️ Processing job ${job.id}: ${job.data.message}`);
      return 'done';
    }, { connection });

    worker.on('completed', job => {
      console.log(`✅ Job ${job.id} completed!`);
    });

    worker.on('failed', (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err);
    });

    // Wait a bit for processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await worker.close();
    await queue.close();
    await connection.quit();
    
  } catch (error) {
    console.error('❌ BullMQ Error:', error);
  }
}

async function runTests() {
  await testVectorService();
  await testUpstashRest();
  await testRedisAndBullMQ();
}

runTests();
