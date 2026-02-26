/**
 * Local doc store: cache fetched documentation by (skill, query) so sabotage
 * can use stored docs without re-calling Serper every time.
 */

const store = new Map<string, string>();

function key(skill: string, query: string): string {
    const s = skill.toLowerCase().trim();
    const q = query.toLowerCase().trim();
    return `${s}::${q}`;
}

export function getDoc(skill: string, query: string): string | null {
    return store.get(key(skill, query)) ?? null;
}

export function setDoc(skill: string, query: string, text: string): void {
    store.set(key(skill, query), text);
}

export function hasDoc(skill: string, query: string): boolean {
    return store.has(key(skill, query));
}
