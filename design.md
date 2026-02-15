# Design Document: CodeRonin Architecture

## 1. System Architecture
CodeRonin utilizes a **Heavy-Client Architecture** to ensure high performance and low operational costs.

- **Frontend:** React 19 + Vite (TypeScript).
- **Runtime:** Pyodide (Python 3.12 via WebAssembly) running in a Web Worker to prevent UI blocking.
- **AI Brain:** Groq Inference Engine (Llama 3-70B) acting as the "Neural Saboteur."
- **Backend:** Node.js Express server for AI orchestration and boilerplate management.

## 2. The Chaos Loop (Data Flow)
1. **Scenario Initialization:** The browser loads a microservice boilerplate into the Monaco Editor.
2. **Coding Phase:** User begins writing logic. The "Chaos Meter" increases based on keystrokes and time.
3. **Sabotage Trigger:** At 100% Chaos, the current code state is sent to the AI Saboteur (Groq).
4. **Bug Injection:** The AI returns a "sabotaged" version of a dependency service.
5. **Detection:** The user sees error logs in the Terminal and service failures in the Trace Map.
6. **Resolution:** User fixes the code; Pyodide runs integration tests to validate the fix.

## 3. Tech Stack Details
- **UI:** Tailwind CSS v3 + Framer Motion (Animations).
- **Editor:** @monaco-editor/react (Industry standard).
- **Auth/Database:** Supabase (User profiles, XP tracking, level persistence).
- **Communication:** REST API for AI interaction; Local State for execution.

## 4. UI/UX Design System
- **Theme:** Deep Black (#050505) with Neon Cyan (#00f3ff) and Glitch Red (#ff003c).
- **Typography:** Orbitron for headers (futuristic) and JetBrains Mono for code.
- **Feedback:** "Sabotage Initiated" modal overlays and pulsing red "Service Down" alerts.

## 5. Security Considerations
- All code execution is sandboxed within the browser's WASM runtime.
- No user-submitted code is executed on the server, preventing RCE (Remote Code Execution) vulnerabilities.
