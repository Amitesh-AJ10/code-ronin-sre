/**
 * Docs service: returns skill-specific doc text for the saboteur.
 * - Library skills (e.g. Pandas): use local doc store first; on miss, fetch via docret then store.
 * - Other skills (OOPS, CP, Cryptography): use static docData (LLM + code + end goal).
 */
import { docData } from "../docs.js";
import { getDocsFromSerper, DOCS_SITES } from "./docret-fetcher.js";
import { getDoc, setDoc } from "./doc-store.js";

const SKILL_TO_KEY: Record<string, string> = {
    Pandas: "pandas",
    pandas: "pandas",
    OOPS: "oops",
    oops: "oops",
    CP: "cp",
    cp: "cp",
    Cryptography: "cryptography",
    cryptography: "cryptography",
};

/** Skills that have official doc sites we fetch via Serper (docret-style). */
const LIBRARY_SKILLS: Record<string, string> = {
    Pandas: "pandas",
    pandas: "pandas",
};

export function getDocKeys(): string[] {
    return Object.keys(docData);
}

export function getDocsForSkill(skill: string): string | null {
    const key = SKILL_TO_KEY[skill] ?? skill.toLowerCase();
    return docData[key] ?? null;
}

export function getAllDocs(): Record<string, string> {
    return { ...docData };
}

/**
 * Fetch docs from official library documentation (docret-style: Serper + scrape).
 * Use for library skills; returns null if library not in DOCS_SITES or API missing.
 */
export async function getDocsFromDocret(
    query: string,
    library: string
): Promise<string | null> {
    if (!DOCS_SITES[library]) return null;
    return getDocsFromSerper(query, library);
}

/**
 * Get doc context for the saboteur: for library skills use local store first, then docret; else use static docs.
 * query: e.g. "DataFrame merge" for Pandas; fallbackQuery used when docret returns nothing.
 */
export async function getDocContextForSkill(
    skill: string,
    query: string,
    fallbackQuery?: string
): Promise<string | null> {
    const skillKey = SKILL_TO_KEY[skill] ?? skill.toLowerCase();
    const library = LIBRARY_SKILLS[skill] ?? LIBRARY_SKILLS[skillKey];
    if (library) {
        const cached = getDoc(skillKey, query);
        if (cached) return cached;
        const fromDocret = await getDocsFromDocret(query, library);
        if (fromDocret) {
            setDoc(skillKey, query, fromDocret);
            return fromDocret;
        }
        if (fallbackQuery && fallbackQuery !== query) {
            const cachedFallback = getDoc(skillKey, fallbackQuery);
            if (cachedFallback) return cachedFallback;
            const retry = await getDocsFromDocret(fallbackQuery, library);
            if (retry) {
                setDoc(skillKey, fallbackQuery, retry);
                return retry;
            }
        }
    }
    return getDocsForSkill(skill);
}
