"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedHTMLElements = exports.MODIFICATIONS_TAG_NAME = exports.WORK_DIR = exports.WORK_DIR_NAME = void 0;
exports.remarkPlugins = remarkPlugins;
exports.rehypePlugins = rehypePlugins;
exports.stripIndents = stripIndents;
//MODIFICATIONS_TAG_NAME, WORK_DIR
exports.WORK_DIR_NAME = 'project';
exports.WORK_DIR = `/home/${exports.WORK_DIR_NAME}`;
exports.MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';
// ---------------------------------------------------------------------------------------------------------------------------------------------------
// allowedHTMLElements
const rehype_raw_1 = __importDefault(require("rehype-raw"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const rehype_sanitize_1 = __importStar(require("rehype-sanitize"));
const unist_util_visit_1 = require("unist-util-visit");
exports.allowedHTMLElements = [
    'a',
    'b',
    'blockquote',
    'br',
    'code',
    'dd',
    'del',
    'details',
    'div',
    'dl',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'ins',
    'kbd',
    'li',
    'ol',
    'p',
    'pre',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'source',
    'span',
    'strike',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'ul',
    'var',
];
const rehypeSanitizeOptions = Object.assign(Object.assign({}, rehype_sanitize_1.defaultSchema), { tagNames: exports.allowedHTMLElements, attributes: Object.assign(Object.assign({}, rehype_sanitize_1.defaultSchema.attributes), { div: [...((_b = (_a = rehype_sanitize_1.defaultSchema.attributes) === null || _a === void 0 ? void 0 : _a.div) !== null && _b !== void 0 ? _b : []), 'data*', ['className', '__boltArtifact__']] }), strip: [] });
function remarkPlugins(limitedMarkdown) {
    const plugins = [remark_gfm_1.default];
    if (limitedMarkdown) {
        plugins.unshift(limitedMarkdownPlugin);
    }
    return plugins;
}
function rehypePlugins(html) {
    const plugins = [];
    if (html) {
        plugins.push(rehype_raw_1.default, [rehype_sanitize_1.default, rehypeSanitizeOptions]);
    }
    return plugins;
}
const limitedMarkdownPlugin = () => {
    return (tree, file) => {
        const contents = file.toString();
        (0, unist_util_visit_1.visit)(tree, (node, index, parent) => {
            if (index == null ||
                ['paragraph', 'text', 'inlineCode', 'code', 'strong', 'emphasis'].includes(node.type) ||
                !node.position) {
                return true;
            }
            let value = contents.slice(node.position.start.offset, node.position.end.offset);
            if (node.type === 'heading') {
                value = `\n${value}`;
            }
            parent.children[index] = {
                type: 'text',
                value,
            };
            return [unist_util_visit_1.SKIP, index];
        });
    };
};
function stripIndents(arg0, ...values) {
    if (typeof arg0 !== 'string') {
        const processedString = arg0.reduce((acc, curr, i) => {
            var _a;
            acc += curr + ((_a = values[i]) !== null && _a !== void 0 ? _a : '');
            return acc;
        }, '');
        return _stripIndents(processedString);
    }
    return _stripIndents(arg0);
}
function _stripIndents(value) {
    return value
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trimStart()
        .replace(/[\r\n]$/, '');
}
