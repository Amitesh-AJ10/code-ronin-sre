import { GoogleGenerativeAI } from "@google/generative-ai";
import { chaosKnowledge } from "../data/chaos-knowledge";
import { mcpClient } from "./mcp-client";

// Initialize Gemini
// NOTE: User must provide VITE_GEMINI_API_KEY in .env.local
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface SabotageResult {
    sabotagedCode: string;
    explanation: string;
    type: 'syntax' | 'logic' | 'semantic';
}

export const saboteurAgent = {
    /**
     * Analyzes the code and injects a bug based on the chaos knowledge base.
     */
    async sabotage(code: string, difficulty: number): Promise<SabotageResult | null> {
        if (!API_KEY) {
            console.warn("Gemini API Key missing!");
            return null;
        }

        // Select a sabotage type based on difficulty/chaos level
        // 0-33%: Syntax, 33-66%: Logic, 66%+: Semantic
        let type: 'syntax' | 'logic' | 'semantic' = 'syntax';
        if (difficulty > 66) type = 'semantic';
        else if (difficulty > 33) type = 'logic';

        // Fetch knowledge from MCP Server or use local fallback
        let knowledgeBase = chaosKnowledge;
        try {
            const remoteKnowledge = await mcpClient.getChaosPatterns();
            if (remoteKnowledge) {
                knowledgeBase = remoteKnowledge;
            }
        } catch (e) {
            console.warn("Using local chaos knowledge fallback", e);
        }

        const knowledge = knowledgeBase[type];
        const pattern = knowledge[Math.floor(Math.random() * knowledge.length)];

        const prompt = `
      You are the "Code Saboteur". Your goal is to inject a realistic bug into the user's Python code.
      
      User Code:
      \`\`\`python
      ${code}
      \`\`\`
      
      Sabotage Type: ${type.toUpperCase()}
      Specific Tactic: ${pattern.name} (${pattern.description})
      
      Instructions:
      1. Modify the code to introduce a subtle bug matching the tactic.
      2. Keep the code mostly identical, just change the specific part.
      3. Return ONLY a JSON object with this structure:
      {
        "sabotagedCode": "The full python code with the bug",
        "explanation": "A short cryptic hint about what broke (e.g. 'The shadows have shifted... check your colons.')",
        "type": "${type}"
      }
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            // Basic cleanup to extract JSON if markdown blocks are present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr) as SabotageResult;
        } catch (error) {
            console.error("Sabotage failed:", error);
            return null;
        }
    }
};
