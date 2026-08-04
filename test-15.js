import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const models = ['gemini-1.5-flash-001', 'gemini-1.5-flash-002'];
  for (const m of models) {
    try {
      console.log('Testing', m);
      const r = await ai.models.generateContent({ model: m, contents: 'hi' });
      console.log('Success', m);
      process.exit(0);
    } catch(e) {
      console.log('Failed', m, e.message.substring(0, 100));
    }
  }
}
run();
