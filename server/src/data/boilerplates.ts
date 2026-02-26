/**
 * Boilerplate templates per (skill, difficulty). Each challenge has code + optional docQuery
 * for sabotage to use when fetching doc context from the local store.
 */

import * as C from "./boilerplate-code.js";

export type DifficultyId = "syntax" | "logic" | "semantic";

export interface TestCase {
    input: string;
    expected: string;
    hidden?: boolean;
}

export interface BoilerplateTemplate {
    id: string;
    code: string;
    docQuery?: string;
    testCases: TestCase[];
}

/** skill -> difficultyId -> list of templates (one chosen at random) */
export const boilerplatesBySkillAndDifficulty: Record<
    string,
    Partial<Record<DifficultyId, BoilerplateTemplate[]>>
> = {
    Pandas: {
        syntax: [
            {
                id: "pandas-csv-syntax",
                code: C.PANDAS_CSV_SYNTAX,
                docQuery: "DataFrame common errors",
                testCases: [
                    { input: "2\nAlice,10\nBob,20", expected: "15.0" },
                    { input: "3\nA,10\nB,30\nC,50", expected: "30.0" }
                ]
            },
            {
                id: "pandas-read-csv-syntax",
                code: C.PANDAS_READ_CSV_SYNTAX,
                docQuery: "DataFrame common errors",
                testCases: [
                    { input: "2\nAlice,10\nBob,20", expected: "15.0" },
                    { input: "1\nA,100", expected: "100.0" }
                ]
            },
        ],
        logic: [
            {
                id: "pandas-groupby-logic",
                code: C.PANDAS_GROUPBY_LOGIC,
                docQuery: "groupby",
                testCases: [
                    { input: "3\nSales,Alice,10\nEng,Bob,20\nSales,Cara,30", expected: "Eng,20.0\nSales,20.0" },
                    { input: "2\nHR,Dave,50\nHR,Eve,60", expected: "HR,55.0" }
                ]
            },
            {
                id: "pandas-filter-logic",
                code: C.PANDAS_FILTER_LOGIC,
                docQuery: "DataFrame indexing",
                testCases: [
                    { input: "3\nAlice,50\nBob,60\nCara,70", expected: "Bob 60\nCara 70" },
                    { input: "2\nAlice,59\nBob,58", expected: "Empty DataFrame\nColumns: [name, score]\nIndex: []" }
                ]
            },
        ],
        semantic: [
            {
                id: "pandas-merge-semantic",
                code: C.PANDAS_MERGE_SEMANTIC,
                docQuery: "merge join",
                testCases: [
                    { input: "2\n1,Alice\n2,Bob\n2\n1,100\n2,200", expected: "1 Alice 100\n2   Bob 200" },
                    { input: "1\n3,Eve\n1\n3,300", expected: "3 Eve 300" }
                ]
            },
        ],
    },
    OOPS: {
        syntax: [{
            id: "oops-class-syntax",
            code: C.OOPS_CLASS_SYNTAX,
            testCases: [
                { input: "Alice, 25", expected: "Hi, I am Alice" },
                { input: "Bob, 30", expected: "Hi, I am Bob" }
            ]
        }],
        logic: [{
            id: "oops-inheritance-logic",
            code: C.OOPS_INHERITANCE_LOGIC,
            testCases: [
                { input: "Buddy, Golden Retriever", expected: "Woof" },
                { input: "Rex, German Shepherd", expected: "Woof" }
            ]
        }],
        semantic: [{
            id: "oops-mutable-default-semantic",
            code: C.OOPS_MUTABLE_DEFAULT_SEMANTIC,
            testCases: [
                { input: "3", expected: "3" },
                { input: "5", expected: "5" }
            ]
        }],
    },
    CP: {
        syntax: [{
            id: "cp-range-syntax",
            code: C.CP_RANGE_SYNTAX,
            testCases: [
                { input: "3\n10\n20\n30", expected: "60" },
                { input: "2\n5\n5", expected: "10" }
            ]
        }],
        logic: [{
            id: "cp-slice-logic",
            code: C.CP_SLICE_LOGIC,
            testCases: [
                { input: "3\n10 20 30 40 50", expected: "60" },
                { input: "2\n5 5 5 5", expected: "10" }
            ]
        }],
        semantic: [{
            id: "cp-division-semantic",
            code: C.CP_DIVISION_SEMANTIC,
            testCases: [
                { input: "10\n3", expected: "3 1" },
                { input: "20\n5", expected: "4 0" }
            ]
        }],
    },
    Cryptography: {
        syntax: [{
            id: "crypto-hash-syntax",
            code: C.CRYPTO_HASH_SYNTAX,
            testCases: [
                { input: "hello", expected: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824" },
                { input: "world", expected: "481f6cc0511143ccdd7e2d1b1b94faf0a700a8e6182db219e748f5334a952098" }
            ]
        }],
        logic: [{
            id: "crypto-compare-logic",
            code: C.CRYPTO_COMPARE_LOGIC,
            testCases: [
                { input: "secret\nsecret", expected: "same" },
                { input: "secret\npassword", expected: "different" }
            ]
        }],
        semantic: [{
            id: "crypto-constant-time-semantic",
            code: C.CRYPTO_CONSTANT_TIME_SEMANTIC,
            testCases: [
                // Note: This output is random (secrets.token_hex), so exact matching won't work easily.
                // For now we will handle this by returning length maybe?
                // Or updating the code to be deterministic for testing.
                // Let's update test expectation to be "REGEX:.*" or just assume the user will see output.
                // Actually, for this specific challenge, let's just make the test case simplistic or ignored by frontend if needed.
                // But for now, let's just put a placeholder and note that crypto might need custom handling.
                // Re-reading code: it prints a hash. It changes every run due to secrets.token_hex.
                // I will modify the code in the next step to be deterministic IF a specific env var/flag is set, or just change the challenge to be deterministic.
                // Better: Update C.CRYPTO_CONSTANT_TIME_SEMANTIC to take an optional seed or not use secrets for the boilerplate version.
                { input: "data", expected: "(dynamic output)" }
            ]
        }],
    },
};
