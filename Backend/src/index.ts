require("dotenv").config();

import express,{Request,Response} from "express";
import { FunctionResponse, GoogleGenAI } from '@google/genai';
import { getSystemPrompt } from './conditional-prompts/SystemPrompts';
import { customPrompt } from "./conditional-prompts/customPrompt";
import { getBasePromptForNextjs } from "./conditional-prompts/nextjsUserPrompt";
import { uiPrompts } from "./conditional-prompts/UiPrompts";
import { getBasePromptForReact } from "./conditional-prompts/reactUserPrompt";
import { ContentTypes } from "./types";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// this ep tells the choice of framework
app.post("/api/template", async (req : Request, res : Response) => {
  const { userPrompt } = req.body;
  const basePromptForReact = getBasePromptForReact(userPrompt);
  const basePromptForNextjs = getBasePromptForNextjs(userPrompt);

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: `Determine framework for: ${userPrompt}. Reply only with 'react' or 'nextjs' again telling you no extra words like - "okay, then, etc..." only reply with either its react or next in lowercase`,
  });
  const answer = response.text?.trim()
  console.log(answer);

  if (answer == 'react' || answer == 'react.js' || answer == 'reactjs' || answer == 'react js') {
    res.json({
      framework: 'React',
      prompts: [basePromptForReact],
      uiPrompt: uiPrompts.reactUiPrompt
    });
  }
  
  else if (answer == 'next' || answer == 'nextjs' || answer == 'next.js' || answer == 'next js') {
    res.json({
      framework: 'Nextjs',
      prompts: [basePromptForNextjs],
      uiPrompt: uiPrompts.nextjsUiPrompt
    });
  }
  
  else {
    throw new Error("Invalid framework specified. Please use 'react' or 'nextjs'.");
  }

})

// this ep give the final output
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const systemPrompt = getSystemPrompt();
    const { message } = req.body;
    // Extract the relevant parts from the message object
    const userMessage = message[0];
    const actualPrompt = userMessage?.rawMessage || '';
    const projectFiles = userMessage?.message1 || '';
    const designGuidelines = userMessage?.message2 || '';
    const breifUserPrompt = userMessage?.message3 || '';

    // Construct the proper prompt
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.0-flash-001',
      contents: [
        `${systemPrompt}`,
        `${projectFiles}`, // Project files context
        `${designGuidelines}`, // Design guidelines
        `${customPrompt.cs1}`, // Custom prompt prefix
        `${breifUserPrompt}`, // this is message3
        `${actualPrompt}`, // The actual user request
        `${customPrompt.cs2}` // Custom prompt suffix
      ].join('\n'),
      config: {
        maxOutputTokens: 20000,
        temperature: 0.9 
      }
    });

    let fullOutput = '';
    for await (const chunk of response) {
      fullOutput += chunk.text || '';
      console.log(chunk.text);
    }

    res.json({ aiOutput: fullOutput });

  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      console.error(error);
      return;
  }

});

app.listen(3000);