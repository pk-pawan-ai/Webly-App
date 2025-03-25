"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const genai_1 = require("@google/genai");
const SystemPrompts_1 = require("./conditional-prompts/SystemPrompts");
const customPrompt_1 = require("./conditional-prompts/customPrompt");
const nextjsUserPrompt_1 = require("./conditional-prompts/nextjsUserPrompt");
const UiPrompts_1 = require("./conditional-prompts/UiPrompts");
const reactUserPrompt_1 = require("./conditional-prompts/reactUserPrompt");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    var _g;
    try {
        const { userPrompt } = req.body;
        const basePromptForReact = (0, reactUserPrompt_1.getBasePromptForReact)(userPrompt);
        const basePromptForNextjs = (0, nextjsUserPrompt_1.getBasePromptForNextjs)(userPrompt);
        const response = yield ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: `Determine framework for: ${userPrompt}. Reply only with 'react' or 'nextjs' again telling you no extra words like - "okay, then, etc..." only reply with either its react or next in lowercase`,
        });
        const systemPrompt = (0, SystemPrompts_1.getSystemPrompt)();
        const answer = (_g = response.text) === null || _g === void 0 ? void 0 : _g.trim();
        console.log(answer);
        if (answer == 'react' || answer == 'react.js' || answer == 'reactjs' || answer == 'react js') {
            const response = yield ai.models.generateContentStream({
                model: 'gemini-2.0-flash-001',
                contents: `${systemPrompt} and one main thing to remember is you have to build any projects in such a way so that the code is ready for production like for example if you are making a todo app then make it in such a way so that on using webcontainers the code should preview in the browser like make every neccessary file like vite.config file, etc.. ${basePromptForReact.role} ${customPrompt_1.customPrompt.cs1} ${basePromptForReact.message1} ${basePromptForReact.message2} ${UiPrompts_1.uiPrompts.reactUiPrompt} ${basePromptForReact.message3} ${customPrompt_1.customPrompt.cs2}`,
                config: {
                    maxOutputTokens: 20000,
                }
            });
            let fullOutput = ``;
            try {
                for (var _h = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _h = true) {
                    _c = response_1_1.value;
                    _h = false;
                    const chunk = _c;
                    fullOutput += chunk.text;
                    console.log(chunk.text);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_h && !_a && (_b = response_1.return)) yield _b.call(response_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            res.json({
                framework: 'React',
                prompts: [basePromptForReact],
                uiPrompt: UiPrompts_1.uiPrompts.reactUiPrompt,
                aiOutput: fullOutput
            });
            return;
        }
        else if (answer == 'next' || answer == 'nextjs' || answer == 'next.js' || answer == 'next js') {
            const response = yield ai.models.generateContentStream({
                model: 'gemini-2.0-flash-001',
                contents: `${systemPrompt} .role} ${customPrompt_1.customPrompt.cs1} ${basePromptForNextjs.message1} ${basePromptForNextjs.message2} ${UiPrompts_1.uiPrompts.nextjsUiPrompt} ${basePromptForNextjs.message3} ${customPrompt_1.customPrompt.cs2}`,
                config: {
                    maxOutputTokens: 20000,
                }
            });
            let fullOutput = ``;
            try {
                for (var _j = true, response_2 = __asyncValues(response), response_2_1; response_2_1 = yield response_2.next(), _d = response_2_1.done, !_d; _j = true) {
                    _f = response_2_1.value;
                    _j = false;
                    const chunk = _f;
                    fullOutput += chunk.text;
                    console.log(chunk.text);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_j && !_d && (_e = response_2.return)) yield _e.call(response_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            res.json({
                framework: 'Next',
                prompts: [basePromptForNextjs],
                uiPrompt: UiPrompts_1.uiPrompts.nextjsUiPrompt,
                aiOutput: fullOutput
            });
            return;
        }
        else {
            throw new Error("Invalid framework specified. Please use 'react' or 'nextjs'.");
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error(error);
        return;
    }
}));
app.listen(3000);
