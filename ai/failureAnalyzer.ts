import { aiClient } from "./aiClient";

export async function analyzeFailure(error: string, url: string) {
  if (!aiClient) return "AI disabled (no API key).";

  const resp = await aiClient.responses.create({
    model: "gpt-4.1-mini",
    input: `
You are a Playwright expert.
Explain this test failure and suggest 3 fixes.

URL: ${url}
Error: ${error}
`
  });

  return resp.output_text;
}
