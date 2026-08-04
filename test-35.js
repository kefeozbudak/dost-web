import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const start = Date.now();
  const r = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: 'hello'
  });
  console.log('Time:', Date.now() - start, 'ms');
  console.log(r.text.substring(0, 100));
}
run();
