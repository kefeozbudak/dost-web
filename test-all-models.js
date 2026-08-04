import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const models = [
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash-lite-001',
    'gemini-3-flash-preview',
    'gemini-omni-flash-preview'
  ];
  for (const m of models) {
    try {
      console.log('Testing', m);
      const r = await ai.models.generateContent({
        model: m,
        contents: 'hello'
      });
      console.log('Success with', m, r.text.substring(0, 20));
      process.exit(0);
    } catch(e) {
      console.log('Failed', m, e.message.substring(0, 100));
    }
  }
}
run();
