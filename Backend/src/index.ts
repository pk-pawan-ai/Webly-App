require("dotenv").config();

import express,{Request,Response} from "express";
import { GoogleGenAI } from '@google/genai';
import { getSystemPrompt } from './conditional-prompts/SystemPrompts';
import { customPrompt } from "./conditional-prompts/customPrompt";
import { getBasePromptForNextjs } from "./conditional-prompts/nextjsUserPrompt";
import { uiPrompts } from "./conditional-prompts/UiPrompts";
import { getBasePromptForReact } from "./conditional-prompts/reactUserPrompt";
import { ContentTypes } from "./types";


const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const systemPrompt = getSystemPrompt();

app.post("/template", async (req: Request, res: Response) => {
  try {    
      const { userPrompt } = req.body;
      const basePromptForReact = getBasePromptForReact(userPrompt);
      const basePromptForNextjs = getBasePromptForNextjs(userPrompt);

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: `Determine framework for: ${userPrompt}. Reply only with 'react' or 'nextjs' again telling you no extra words like - "okay, then, etc..." only reply with either its react or next in lowercase`,
      });

      const systemPrompt = getSystemPrompt();
      
      const answer = response.text?.trim();
      console.log(answer);

      if (answer == 'react' || answer == 'react.js' || answer == 'reactjs' || answer == 'react js'){  
        const response = await ai.models.generateContentStream({
          model: 'gemini-2.0-flash-001',
          contents: `${systemPrompt} ${basePromptForReact.role} ${customPrompt.cs1} ${basePromptForReact.message1} ${basePromptForReact.message2} ${basePromptForReact.message3} ${customPrompt.cs2}`,
          config: {
            maxOutputTokens: 20000,
          }
        });
        
        for await (const chunk of response) {
          console.log(chunk.text);
        } 
        res.json({
          framework: 'React',
          prompts: [basePromptForReact],
          uiPrompt: uiPrompts.reactUiPrompt
        });
        return;
      } 
      
      else if (answer == 'next' || answer == 'nextjs' || answer == 'next.js' || answer == 'next js') {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.0-flash-001',
            contents: `${systemPrompt} .role} ${customPrompt.cs1} ${basePromptForNextjs.message1} ${basePromptForNextjs.message2} ${basePromptForNextjs.message3} ${customPrompt.cs2}`,
            config: {
              maxOutputTokens: 20000,
            }
        });
        
        for await (const chunk of response) {
            console.log(chunk.text);
        }
        res.json({
          framework: 'Next',
          prompts: [basePromptForNextjs],
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

app.listen(3000);