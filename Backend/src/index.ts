require("dotenv").config();

import express,{Request,Response} from "express";
import { GoogleGenAI } from '@google/genai';
import { getSystemPrompt } from './conditional-prompts/SystemPrompts';
import { customPrompt } from "./conditional-prompts/customPrompt";
import { getBasePromptForNextjs } from "./conditional-prompts/nextjsUserPrompt";
import { uiPrompts } from "./conditional-prompts/UiPrompts";
import { getBasePromptForReact } from "./conditional-prompts/reactUserPrompt";

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const systemPrompt = getSystemPrompt();

app.post("/api/template", async (req: Request, res: Response) => {
  try {    
      const { userPrompt } = req.body;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: `Determine framework for: ${userPrompt}. Reply only with 'react' or 'nextjs' again telling you no extra words like - "okay, then, etc..." only reply with either its react or next in lowercase`,
      });

      const answer = response.text?.trim();

      if (answer == 'react' || answer == 'react.js' || answer == 'reactjs' || answer == 'react js'){
        res.json({
          framework: 'React',
          prompts: [getBasePromptForReact(userPrompt)],
          uiPrompt: uiPrompts.reactUiPrompt
        });
        return;
      } 
      
      else if (answer == 'next' || answer == 'nextjs' || answer == 'next.js' || answer == 'next js') {
        res.json({
          framework: 'Next',
          prompts: [getBasePromptForNextjs(userPrompt)],
          uiPrompt: uiPrompts.nextjsUiPrompt
        });
        return;
      }

    else {
      throw new Error("Invalid framework specified. Please use 'react' or 'nextjs'.");
    }

  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      console.error(error);
      return;
  }

});

app.post("/api/chat", async (req : Request, res : Response) => {
  const { messages } = req.body;
  const response = await ai.models.generateContentStream({
    model: 'gemini-2.0-flash-001',
    contents: `${systemPrompt} ${customPrompt.cs1} ${customPrompt.cs2}`
  });
  
  for await (const chunk of response) {
    console.log(chunk.text);
  }
  res.json({});
});

app.listen(3000);