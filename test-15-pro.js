import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const r = await ai.models.generateContent({ model: 'gemini-1.5-pro', contents: 'hi' });
    console.log('Success', r.text.substring(0, 10));
  } catch(e) {
    console.log('Failed', e.message.substring(0, 100));
  }
}
run();
