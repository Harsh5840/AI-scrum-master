import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log('🔍 Testing Gemini API Key...');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in environment');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
  const modelNames = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest'
  ];

  for (const modelName of modelNames) {
    try {
      console.log(`\n📝 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const prompt = "Say hello in one sentence";
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} works!`);
      console.log(`Response: ${text}`);
      break; // If we find a working model, stop testing
    } catch (error: any) {
      console.log(`❌ ${modelName} failed: ${error.message}`);
    }
  }
}

testModels().catch(console.error);
