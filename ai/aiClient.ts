import OpenAI from "openai";

export const aiClient = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});
