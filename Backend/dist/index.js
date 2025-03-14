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
const prompts_1 = require("./prompts");
const customPrompt_1 = require("./conditional-prompts/customPrompt");
const reactUserPrompt_1 = require("./conditional-prompts/reactUserPrompt");
const nextjsUserPrompt_1 = require("./conditional-prompts/nextjsUserPrompt");
const UiPrompts_1 = require("./conditional-prompts/UiPrompts");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
let userPrompt;
app.get("/template", (req, res) => {
    const { userPrompt } = req.body;
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield ai.models.generateContent({
                model: 'gemini-2.0-flash-001',
                contents: `when ever user gives you the prompt to make any project without telling any tech-stack then you should decide either you will use react or next.js and if user tells you to make in specific tech stack then you should follow that, \n Now, after your decision you have to mention either it is react or next.js and remember that only mention react or next.js nothing else like "is, the, etc..." nothing just mention either it's react or next.js`,
            });
            const answer = response.text;
            if (answer == 'react' || 'react.js' || 'react') {
                function mainReact() {
                    return __awaiter(this, void 0, void 0, function* () {
                        var _a, e_1, _b, _c;
                        const systemPrompt = (0, prompts_1.getSystemPrompt)();
                        const response = yield ai.models.generateContentStream({
                            model: 'gemini-2.0-flash-001',
                            contents: `${systemPrompt} ${reactUserPrompt_1.basePromptForReact.role} ${customPrompt_1.customPrompt.cs1} ${reactUserPrompt_1.basePromptForReact.message1} ${reactUserPrompt_1.basePromptForReact.message2} ${reactUserPrompt_1.basePromptForReact.message3} ${customPrompt_1.customPrompt.cs2}`
                        });
                        try {
                            for (var _d = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _d = true) {
                                _c = response_1_1.value;
                                _d = false;
                                const chunk = _c;
                                console.log(chunk.text);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (!_d && !_a && (_b = response_1.return)) yield _b.call(response_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        res.json({ prompts: [reactUserPrompt_1.basePromptForReact], reactUiPrompt: [UiPrompts_1.uiPrompts.reactUiPrompt] });
                    });
                }
                mainReact();
            }
            if (answer == 'next' || 'next.js' || 'nextjs') {
                function mainNextJs() {
                    return __awaiter(this, void 0, void 0, function* () {
                        var _a, e_2, _b, _c;
                        const systemPrompt = (0, prompts_1.getSystemPrompt)();
                        const response = yield ai.models.generateContentStream({
                            model: 'gemini-2.0-flash-001',
                            contents: `${systemPrompt} ${nextjsUserPrompt_1.basePromptForNextjs.role} ${customPrompt_1.customPrompt.cs1} ${nextjsUserPrompt_1.basePromptForNextjs.message1} ${nextjsUserPrompt_1.basePromptForNextjs.message2} ${nextjsUserPrompt_1.basePromptForNextjs.message3} ${customPrompt_1.customPrompt.cs2}`
                        });
                        try {
                            for (var _d = true, response_2 = __asyncValues(response), response_2_1; response_2_1 = yield response_2.next(), _a = response_2_1.done, !_a; _d = true) {
                                _c = response_2_1.value;
                                _d = false;
                                const chunk = _c;
                                console.log(chunk.text);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (!_d && !_a && (_b = response_2.return)) yield _b.call(response_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        res.json({ prompts: [reactUserPrompt_1.basePromptForReact], nextjsUiPrompt: [UiPrompts_1.uiPrompts.nextjsUiPrompt] });
                    });
                }
                mainNextJs();
            }
        });
    }
    main();
});
exports.default = userPrompt;
app.listen(3000);
