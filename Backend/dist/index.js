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
const app = (0, express_1.default)();
app.use(express_1.default.json());
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
const systemPrompt = (0, SystemPrompts_1.getSystemPrompt)();
app.post("/api/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userPrompt } = req.body;
        const response = yield ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: `Determine framework for: ${userPrompt}. Reply only with 'react' or 'nextjs' again telling you no extra words like - "okay, then, etc..." only reply with either its react or next in lowercase`,
        });
        const answer = (_a = response.text) === null || _a === void 0 ? void 0 : _a.trim();
        if (answer == 'react' || answer == 'react.js' || answer == 'reactjs' || answer == 'react js') {
            res.json({
                framework: 'React',
                prompts: [(0, reactUserPrompt_1.getBasePromptForReact)(userPrompt)],
                uiPrompt: UiPrompts_1.uiPrompts.reactUiPrompt
            });
            return;
        }
        else if (answer == 'next' || answer == 'nextjs' || answer == 'next.js' || answer == 'next js') {
            res.json({
                framework: 'Next',
                prompts: [(0, nextjsUserPrompt_1.getBasePromptForNextjs)(userPrompt)],
                uiPrompt: UiPrompts_1.uiPrompts.nextjsUiPrompt
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
app.post("/api/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const { messages } = req.body;
    const response = yield ai.models.generateContentStream({
        model: 'gemini-2.0-flash-001',
        contents: `${systemPrompt} ${customPrompt_1.customPrompt.cs1} ${customPrompt_1.customPrompt.cs2}`
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
    res.json({});
}));
app.listen(3000);
