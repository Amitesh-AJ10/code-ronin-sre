/**
 * Docret-style docs fetcher: Serper API + fetch + HTML parsing.
 * Mirrors https://github.com/Sreedeep-SS/docret-mcp-server behavior so we can
 * fetch official Python library docs without running the Python MCP server.
 */

const SERPER_URL = "https://google.serper.dev/search";
const MAX_RESULTS = 2;
const FETCH_TIMEOUT_MS = 15000;

/** Library -> official docs site (same idea as docret docs_urls). */
export const DOCS_SITES: Record<string, string> = {
    langchain: "python.langchain.com/docs",
    "llama-index": "docs.llamaindex.ai/en/stable",
    openai: "platform.openai.com/docs",
    pandas: "pandas.pydata.org/docs",
};

export interface SerperOrganicResult {
    link: string;
    title?: string;
    snippet?: string;
}

export interface SerperResponse {
    organic?: SerperOrganicResult[];
}

/**
 * Search via Serper API (site-scoped query).
 */
async function searchWeb(query: string): Promise<SerperResponse | null> {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
        console.warn("SERPER_API_KEY not set; docret fetch will be skipped.");
        return null;
    }

    try {
        const res = await fetch(SERPER_URL, {
            method: "POST",
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ q: query, num: MAX_RESULTS }),
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!res.ok) return null;
        return (await res.json()) as SerperResponse;
    } catch (e) {
        console.warn("Serper search failed:", e);
        return null;
    }
}

/**
 * Fetch URL and return plain text extracted from HTML (strip tags).
 */
async function fetchUrlAsText(url: string): Promise<string> {
    try {
        const res = await fetch(url, {
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            headers: { "User-Agent": "CodeRonin-Docs/1.0" },
        });
        if (!res.ok) return "";
        const html = await res.text();
        return stripHtmlToText(html);
    } catch {
        return "";
    }
}

/** Simple HTML tag stripping (no cheerio dep for minimal bundle). */
function stripHtmlToText(html: string): string {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Fetch documentation text for a (query, library) using Serper + scrape.
 * Returns null if library not in DOCS_SITES or API/key missing.
 */
export async function getDocsFromSerper(
    query: string,
    library: string
): Promise<string | null> {
    const site = DOCS_SITES[library];
    if (!site) return null;

    const siteQuery = `site:${site} ${query}`;
    const results = await searchWeb(siteQuery);
    const organic = results?.organic ?? [];
    if (organic.length === 0) return null;

    const chunks: string[] = [];
    for (let i = 0; i < Math.min(organic.length, MAX_RESULTS); i++) {
        const text = await fetchUrlAsText(organic[i].link);
        if (text) chunks.push(text);
    }
    return chunks.length > 0 ? chunks.join("\n\n") : null;
}
