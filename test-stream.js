import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const start = Date.now();
  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-flash-latest',
    contents: 'dost kolejini anlat'
  });
  for await (const chunk of responseStream) {
    console.log('Chunk time:', Date.now() - start, 'ms', 'Text:', chunk.text);
  }
}
run();
