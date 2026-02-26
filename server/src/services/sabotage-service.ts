/**
 * Sabotage service: builds saboteur prompt with chaos patterns + doc context + end goal,
 * calls Groq (Llama), returns sabotaged code + explanation.
 */
import path from "path";
import dotenv from "dotenv";

// Load .env.local before reading env (ESM loads this module before index.ts top-level runs)
const cwd = process.cwd();
dotenv.config({ path: path.join(cwd, ".env.local") });
dotenv.config({ path: path.join(cwd, "..", ".env.local") });

import Groq from "groq-sdk";
import { chaosResources } from "../resources.js";
import { getDocContextForSkill } from "./docs-service.js";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? process.env.VITE_GROQ_API_KEY ?? "";
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;
const SABOTAGE_MODEL = "llama-3.1-8b-instant";

export type SabotageType = "syntax" | "logic" | "semantic";

export interface SabotageResult {
    sabotagedCode: string;
    explanation: string;
    type: SabotageType;
}

export interface SabotageInput {
    code: string;
    difficulty: number;
    skill?: string;
    endGoal?: string;
    /** Optional: use this doc query for context (from boilerplate challenge) instead of deriving from code. */
    docQuery?: string;
    challengeId?: string;
}

/**
 * Derive a short doc-search query from code (for library docs).
 */
function queryFromCode(code: string, skill?: string): string {
    const lower = code.toLowerCase();
    if (skill?.toLowerCase() === "pandas" || lower.includes("pandas") || lower.includes("dataframe")) {
        return "DataFrame common errors";
    }
    if (lower.includes("merge") || lower.includes("join")) return "merge join";
    if (lower.includes("groupby")) return "groupby";
    return "common errors";
}

/**
 * Run saboteur: get chaos + doc context, build prompt, call Groq.
 */
export async function runSabotage(input: SabotageInput): Promise<SabotageResult | null> {
    if (!groq || !GROQ_API_KEY) {
        console.warn("GROQ_API_KEY not set; sabotage skipped.");
        return null;
    }

    const { code, difficulty, skill, endGoal, docQuery: explicitDocQuery } = input;

    // Sabotage type from difficulty (0–33: syntax, 33–66: logic, 66+: semantic)
    let type: SabotageType = "syntax";
    if (difficulty > 66) type = "semantic";
    else if (difficulty > 33) type = "logic";

    const patterns = chaosResources[type];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    // Doc context: use explicit docQuery from boilerplate when provided, else derive from code; then store-first fetch
    let docContext: string | null = null;
    if (skill) {
        const query = explicitDocQuery ?? queryFromCode(code, skill);
        docContext = await getDocContextForSkill(skill, query, "common errors");
    }

    const docSection = docContext
        ? `\nSkill / documentation context (use to make the bug realistic and aligned with this skill):\n${docContext.slice(0, 4000)}\n`
        : "";

    const endGoalSection = endGoal
        ? `\nUser's end goal (intended behavior): ${endGoal}\n`
        : "";

    const buildPrompt = (strict: boolean) => `You are the "Code Saboteur". Your goal is to inject a realistic bug into the user's Python code.
${endGoalSection}
User Code:
\`\`\`python
${code}
\`\`\`
${docSection}
Sabotage Type: ${type.toUpperCase()}
Specific Tactic: ${pattern.name} (${pattern.description})

Instructions:
1. Modify the code to introduce a subtle bug matching the tactic.
2. Keep the code mostly identical, just change the specific part. Do NOT add code outside the existing function scopes or at the global level unless it existed before.
3. Do NOT add any new comments explaining the bug. The bug must be stealthy.
${strict ? "4. IMPORTANT: The sabotaged code MUST differ from the original (beyond whitespace). If you struggle, change a single character in a string literal or operator. Ensure the code remains syntactically valid (no indentation errors)." : "4. The explanation should match the specific change you made. Ensure the code remains syntactically valid."}
${strict ? 6 : 5}. Return using EXACTLY this format with delimiters (no JSON, no markdown):

---CODE_START---
(full sabotaged Python code here)
---CODE_END---
---HINT_START---
(a short cryptic hint, gamified like a treasure hunt clue)
---HINT_END---`;

    const normalizeCode = (value: string) => value.replace(/\r\n/g, "\n").trim();
    const isMeaningfullyDifferent = (original: string, sabotaged: string) => {
        const a = normalizeCode(original);
        const b = normalizeCode(sabotaged);
        return a !== b;
    };

    const parseDelimitedResponse = (text: string): SabotageResult | null => {
        const codeMatch = text.match(/---CODE_START---\s*([\s\S]*?)\s*---CODE_END---/);
        const hintMatch = text.match(/---HINT_START---\s*([\s\S]*?)\s*---HINT_END---/);
        if (!codeMatch || !hintMatch) return null;
        return {
            sabotagedCode: codeMatch[1].trim(),
            explanation: hintMatch[1].trim(),
            type,
        };
    };

    const callGroq = async (strict: boolean): Promise<SabotageResult | null> => {
        const completion = await groq.chat.completions.create({
            model: SABOTAGE_MODEL,
            messages: [{ role: "user", content: buildPrompt(strict) }],
            temperature: 0.4,
            max_tokens: 2048,
        });
        const text = completion.choices[0]?.message?.content?.trim() ?? "";
        return parseDelimitedResponse(text);
    };

    try {
        const first = await callGroq(false);
        if (first?.sabotagedCode && isMeaningfullyDifferent(code, first.sabotagedCode)) {
            return first;
        }
        const second = await callGroq(true);
        if (second?.sabotagedCode && isMeaningfullyDifferent(code, second.sabotagedCode)) {
            return second;
        }
        return null;
    } catch (error) {
        console.error("Sabotage failed:", error);
        return null;
    }
}

/**
 * Escape raw newlines/tabs inside JSON string values so JSON.parse() succeeds.
 * LLMs often return literal newlines in multi-line string fields (e.g. sabotagedCode).
 */
function escapeControlCharsInJsonStrings(raw: string): string {
    let out = "";
    let inString = false;
    let escaped = false;
    for (let i = 0; i < raw.length; i++) {
        const c = raw[i];
        if (escaped) {
            out += c;
            escaped = false;
            continue;
        }
        if (c === "\\" && inString) {
            out += c;
            escaped = true;
            continue;
        }
        if (c === '"') {
            inString = !inString;
            out += c;
            continue;
        }
        if (inString) {
            if (c === "\n") {
                out += "\\n";
            } else if (c === "\r") {
                out += "\\r";
            } else if (c === "\t") {
                out += "\\t";
            } else {
                out += c;
            }
        } else {
            out += c;
        }
    }
    return out;
}
