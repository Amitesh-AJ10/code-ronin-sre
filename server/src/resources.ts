export type SabotageType = 'syntax' | 'logic' | 'semantic';

export interface ChaosPattern {
    name: string;
    description: string;
}

export const chaosResources: Record<SabotageType, ChaosPattern[]> = {
    syntax: [
        { name: "The Missing Colon", description: "Remove a colon after if/else/def/for statements." },
        { name: "Indentation Ghost", description: "Slightly misalign indentation in a block." },
        { name: "Typo Gremlin", description: "Introduce a typo in a variable name usage (not definition)." },
        { name: "Unclosed String", description: "Remove a closing quote from a string." }
    ],
    logic: [
        { name: "Off-by-One", description: "Change range(n) to range(n+1) or index access." },
        { name: "Condition Flip", description: "Swap == with != or > with >=." },
        { name: "Infinite Loop", description: "Alter loop condition so it never terminates (subtly)." },
        { name: "Variable Shadowing", description: "Reuse a variable name from outer scope in inner scope to confuse logic." }
    ],
    semantic: [
        { name: "Numpy Shape Mismatch", description: "Reshape array to incompatible dimensions." },
        { name: "Pandas Index Error", description: "Access a non-existent column or index in DataFrame." },
        { name: "Type Mismatch", description: "Perform operation on incompatible types (e.g. int + str)." },
        { name: "Mutable Default Arg", description: "Use a mutable default argument in function definition." }
    ]
};
