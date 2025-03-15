require("dotenv").config();

import express,{Request,Response} from "express";
import { GoogleGenAI } from '@google/genai';
import { getSystemPrompt } from './prompts';
import { customPrompt } from "./conditional-prompts/customPrompt";
import { basePromptForReact } from "./conditional-prompts/reactUserPrompt";
import { basePromptForNextjs } from "./conditional-prompts/nextjsUserPrompt";
import { uiPrompts } from "./conditional-prompts/UiPrompts";

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

let userPrompt : string | any;

app.post("/template", async (req: Request, res: Response) => {
  try {    
      const { userPrompt } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: `Determine framework for: ${userPrompt}. Reply only with 'react' or 'nextjs' again telling you no extra words like - "okay, then, etc..." only reply with either its react or next`,
      });
      const answer = response.text?.toLowerCase();
      const systemPrompt = getSystemPrompt();

      if (answer === 'react' || answer === 'react.js' || answer === 'react'){  
        const response = await ai.models.generateContentStream({
          model: 'gemini-2.0-flash-001',
          contents: `${systemPrompt} ${basePromptForReact.role} ${customPrompt.cs1} ${basePromptForReact.message1} ${basePromptForReact.message2} ${basePromptForReact.message3} ${customPrompt.cs2}`
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
      
      else if (answer === 'next' || answer === 'next.js' || answer === 'nextjs') {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.0-flash-001',
            contents: `${systemPrompt} ${basePromptForNextjs.role} ${customPrompt.cs1} ${basePromptForNextjs.message1} ${basePromptForNextjs.message2} ${basePromptForNextjs.message3} ${customPrompt.cs2}`
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

  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      return;
  }

});

export default userPrompt;

app.listen(3000);

