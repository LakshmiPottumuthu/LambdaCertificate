// import { aiClient } from "./aiClient";

// export async function generateTestSteps(flow: string){
//     const resp = await aiClient.responses.create({

//         model: "gpt-4.1-mini",
//         input: `You are a Senior QA Engineer. Convert this flow into concise Playwright steps (English bullets only).\n\nFlow:\n${flow}`,
    
//     });

//     return resp.output_text;

// }