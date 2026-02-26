/**
 * Boilerplate service: returns a random template for (skill, difficultyId)
 * for the Arena to use as initial editor content.
 */
import {
    boilerplatesBySkillAndDifficulty,
    type DifficultyId,
    type BoilerplateTemplate,
} from "../data/boilerplates.js";

const DEFAULT_CODE = `# Write your Python code here
print('Hello, CodeRonin!')
`;

export interface BoilerplateResult {
    code: string;
    challengeId?: string;
    docQuery?: string;
    testCases?: { input: string; expected: string; hidden?: boolean }[];
}

const VALID_DIFFICULTY_IDS: DifficultyId[] = ["syntax", "logic", "semantic"];

function normalizeSkill(skill: string): string {
    const s = skill?.trim() ?? "";
    if (s === "oops" || s === "OOPS") return "OOPS";
    if (s === "cp" || s === "CP") return "CP";
    if (s === "cryptography" || s === "Cryptography") return "Cryptography";
    if (s === "pandas" || s === "Pandas") return "Pandas";
    return s || "Pandas";
}

function normalizeDifficulty(difficultyId: string): DifficultyId {
    const d = difficultyId?.toLowerCase().trim() ?? "syntax";
    if (VALID_DIFFICULTY_IDS.includes(d as DifficultyId)) return d as DifficultyId;
    return "syntax";
}

/**
 * Get a random boilerplate for the given skill and difficulty.
 * Returns default placeholder if no template exists for that combination.
 */
export function getBoilerplate(skill: string, difficultyId: string): BoilerplateResult {
    const sk = normalizeSkill(skill);
    const diff = normalizeDifficulty(difficultyId);
    const bySkill = boilerplatesBySkillAndDifficulty[sk];
    if (!bySkill) {
        return { code: DEFAULT_CODE };
    }
    const templates = bySkill[diff] as BoilerplateTemplate[] | undefined;
    if (!templates || templates.length === 0) {
        return { code: DEFAULT_CODE };
    }
    const template = templates[Math.floor(Math.random() * templates.length)];
    return {
        code: template.code,
        challengeId: template.id,
        docQuery: template.docQuery,
        testCases: template.testCases,
    };
}
