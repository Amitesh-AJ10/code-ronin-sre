# CodeRonin: Project Context

## 1. Overview
**CodeRonin** is a "Debug Dojo" where an AI **Saboteur** actively injects bugs into the user's code. The goal is to build resilience and debugging skills by fixing these stealthy bugs and passing strict test cases.

## 2. Architecture & Stack
*   **Frontend**: React 19, Vite, TailwindCSS (Cyberpunk Design), Monaco Editor, Framer Motion.
*   **Runtime**: **Pyodide (v0.24.1)** running Python 3.12+ in the browser (WASM).
    *   *Note*: Downgraded to v0.24.1 for stability.
    *   *Execution*: handled by `src/lib/pyodide.ts`.
*   **Backend**: Node.js + Express.
    *   **Saboteur**: `server/src/services/sabotage-service.ts` uses **Groq (Llama 3)** to generate context-aware bugs.
    *   **Boilerplate**: `server/src/services/boilerplate-service.ts` serves incomplete code templates and test cases.
*   **Database**: Supabase (Auth & Persistence).
*   **Docs/Knowledge**: `server/src/services/docret-fetcher.ts` fetches live docs (Serper API) or uses static fallbacks.

## 3. Core Workflow
1.  **Skill & Difficulty**: User selects Skill (Pandas, OOPS, etc.) and Difficulty (Syntax, Logic, Semantic).
2.  **Arena**:
    *   User receives **Boilerplate Code** (deliberately incomplete with TODOs).
    *   **Chaos Meter** fills as code is written.
    *   At 100%, **Sabotage** triggers: The backend injects a bug *without comments* and ensuring *valid scope*.
3.  **Validation**:
    *   User runs code -> Pyodide executes.
    *   **Test Cases**: Fetched from backend (`server/src/data/boilerplates.ts`).
    *   **Stdin/Stdout**: First test case input is auto-filled into stdin to prevent "No output" errors.
    *   **Pandas**: Output configured to `header=False` to match clean test expectations.

## 4. Project Structure
```text
code-ronin/
├── src/
│   ├── components/       # Arena.tsx (Game Loop), Skills.tsx, Difficulty.tsx
│   ├── lib/              # pyodide.ts (Runtime), supabase.ts (Auth)
│   ├── data/             # chaos-knowledge.ts (Fallback patterns)
│   └── App.tsx           # Routing
├── server/
│   ├── src/
│   │   ├── index.ts      # Express App + API Routes
│   │   ├── services/     # sabotage-service.ts, boilerplate-service.ts
│   │   └── data/         # boilerplate-code.ts (Templates), boilerplates.ts (Tests)
└── README.md
```

## 5. Critical Implementation Details
*   **Sabotage Rules**: The AI must **never** add comments revealing the bug and must respect function scope to avoid `NameError`.
*   **Boilerplate**: Must be incomplete (requires user logic) but runnable enough to test.
*   **Troubleshooting**:
    *   *No Output Generated*: Often due to empty Stdin. **Fix**: Auto-inject test input.
    *   *Pandas Mismatch*: `to_string` includes headers by default. **Fix**: Force `header=False`.
    *   *Saboteur Failures*: Check `GROQ_API_KEY` in `server/.env`.

## 6. Design System (Highlights)
*   **Theme**: Cyberpunk (Dark Mode #050505, Neon Cyan #00f3ff, Glitch Red #ff003c).
*   **Components**: Glassmorphism cards, scanlines overlay, orbitron/jetbrains-mono fonts.
