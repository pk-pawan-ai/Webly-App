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

app.get("/template", (req: Request, res: Response) => {
    const { userPrompt } = req.body;
    
    async function main() {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-001',
          contents: `when ever user gives you the prompt to make any project without telling any tech-stack then you should decide either you will use react or next.js and if user tells you to make in specific tech stack then you should follow that, \n Now, after your decision you have to mention either it is react or next.js and remember that only mention react or next.js nothing else like "is, the, etc..." nothing just mention either it's react or next.js`,
        });
        const answer = response.text;

        if (answer == 'react' || 'react.js' || 'react'){
            async function mainReact() {
                const systemPrompt = getSystemPrompt();
              
                const response = await ai.models.generateContentStream({
                  model: 'gemini-2.0-flash-001',
                  contents: `${systemPrompt} ${basePromptForReact.role} ${customPrompt.cs1} ${basePromptForReact.message1} ${basePromptForReact.message2} ${basePromptForReact.message3} ${customPrompt.cs2}`
                });
                for await (const chunk of response) {
                  console.log(chunk.text);
                } 

                res.json({ prompts : [basePromptForReact], reactUiPrompt : [uiPrompts.reactUiPrompt] });
            
            }

            mainReact();

        }

        if (answer == 'next' || 'next.js' || 'nextjs'){
            async function mainNextJs() {
                const systemPrompt = getSystemPrompt();
              
                const response = await ai.models.generateContentStream({
                  model: 'gemini-2.0-flash-001',
                  contents: `${systemPrompt} ${basePromptForNextjs.role} ${customPrompt.cs1} ${basePromptForNextjs.message1} ${basePromptForNextjs.message2} ${basePromptForNextjs.message3} ${customPrompt.cs2}`
                });
                for await (const chunk of response) {
                  console.log(chunk.text);
                }

                res.json({ prompts : [basePromptForReact], nextjsUiPrompt : [uiPrompts.nextjsUiPrompt] });

            }

            mainNextJs();
            
        }

      }
    
    main();

});

export default userPrompt;

app.listen(3000);