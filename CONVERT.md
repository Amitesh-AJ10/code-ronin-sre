
# CodeRonin-SRE Conversion Guide

This document explains how this repo diverges from the original **Server Survival** game and how to implement the new **CodeRonin-SRE Arena** experience on top of the existing codebase.

The goal is to keep the **core simulation mechanics and 3D game implementation**, but transform the game into an **AI-powered SRE training arena** that uses **AWS Bedrock** to generate:

- **AI Sabotage Events** (targeted attacks on the player’s architecture)
- **AI Post-Mortems** (brutal but educational failure analyses)

The visual identity is reskinned to the **CodeRonin cyberpunk debug dojo** style described in `design.md`.

> Note: The original implementation is MIT-licensed. We are keeping the implementation, rebranding the experience, and layering new AI + UI behavior on top.

---

## 1. Renaming & Rebranding

### 1.1 Product Name & Copy

- Replace all visible mentions of:
  - **"Server Survival"** → **"CodeRonin-SRE Arena"**
  - Any "game" wording that feels casual should be reframed as an **SRE training arena**.
- Update:
  - HTML `<title>` tags.
  - Main menu headers.
  - Any in-game overlays or modals that show the original name.

### 1.2 Visual Theme

Use `design.md` as the single source of truth for the new visual identity:

- **Theme**: Cyberpunk debug dojo (dark, neon, glassy, glitchy).
- **Base Background**: `#050505`.
- **Primary Accent**: `#00F3FF` (neon cyan).
- **Error / Danger**: `#FF003C` (glitch red).

Implementation details:

- Keep the Three.js scene and camera logic, but adjust:
  - Background colors / gradients.
  - UI panel backgrounds to translucent/glass cards.
  - Text styles to match the new typography guidance.
- Add glitch/scanline/grid effects per `design.md` using CSS and/or small Three.js overlays.

### 1.3 AWS Bedrock Branding

- Add a small, tasteful **“Powered by AWS Bedrock”** badge:
  - Bottom-right corner of the HUD or main menu.
  - Non-intrusive, but always visible when AI features are active.

---

## 2. High-Level Architecture

We are converting a **pure frontend (HTML/JS/Three.js)** game into a **frontend + Node.js backend** system:

- **Frontend** (existing):
  - `index.html`, `style.css`, `game.js`, `src/` modules.
  - Responsible for rendering, handling input, and running the core simulation.

- **Backend** (new):
  - New `backend/` directory.
  - Minimal **Express** server that:
    - Exposes **REST APIs** for sabotage and post-mortems.
    - Calls **AWS Bedrock** using the AWS SDK.

### 2.1 Backend Responsibilities

Backend must provide at least two endpoints:

1. `POST /api/sabotage`
   - Input: current architecture/services on the board.
   - Output: a JSON payload describing an attack, including:
     - `trafficType`: `"MALICIOUS" | "READ" | "WRITE"` (extendable later).
     - `intensity`: number (0–100-ish) to scale the event.
     - `saboteurMessage`: short taunting/explanatory message from the AI.

2. `POST /api/postmortem`
   - Input: final architecture + survival time.
   - Output: a **3-sentence** senior-SRE style post-mortem string that:
     - Explains why the architecture failed.
     - Calls out 1–2 specific mistakes.
     - Suggests concrete fixes.

The backend will use **AWS Bedrock** models (e.g. Claude 3 Haiku or Llama 3) to generate both responses.

---

## 3. Backend Implementation Details

### 3.1 Folder & Files

- Create a `backend/` folder with:
  - `backend/server.js` – Express app entry point.
  - `backend/bedrockClient.js` (optional helper) – wraps AWS Bedrock calls.
  - `.env` (not committed) – AWS credentials and config.

### 3.2 Dependencies

Install backend dependencies from the repo root:

```bash
npm init -y              # if not already initialized
npm install express cors dotenv @aws-sdk/client-bedrock-runtime
```

### 3.3 Environment Variables

Use `.env` for secrets/config:

- `AWS_REGION` – e.g. `us-east-1`.
- `BEDROCK_MODEL_ID` – e.g. `anthropic.claude-3-haiku-20240307-v1:0`.
- Standard AWS auth variables (or shared credentials):
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - Optionally `AWS_SESSION_TOKEN`

The server should:

- Load `.env` with `dotenv`.
- Create a `BedrockRuntimeClient` from `@aws-sdk/client-bedrock-runtime`.
- Provide helper functions:
  - `generateSabotage(services: string[]): Promise<SabotagePayload>`
  - `generatePostmortem(services: string[], survivalTimeSeconds: number): Promise<string>`

### 3.4 API Contracts

#### 3.4.1 `/api/sabotage`

- **Request (JSON)**:

```json
{
  "services": ["Firewall", "Load Balancer", "SQL DB"]
}
```

- **Prompt Template (conceptual)**:

> You are an AI Saboteur. The player's cloud architecture contains: [SERVICES]. Identify the weakest link. Generate a JSON payload for an attack: {"trafficType": "MALICIOUS" | "READ" | "WRITE", "intensity": 50, "saboteurMessage": "Your taunting message about their weak architecture."}

- **Response (JSON)**:

```json
{
  "trafficType": "MALICIOUS",
  "intensity": 65,
  "saboteurMessage": "Your single firewall is overloaded and unprotected on the backend path."
}
```

The backend should:

- Validate/normalize the model output to this exact shape.
- Default to a safe fallback if parsing fails (e.g. mild malicious traffic).

#### 3.4.2 `/api/postmortem`

- **Request (JSON)**:

```json
{
  "services": [
    "Firewall",
    "API Gateway",
    "Load Balancer",
    "Message Queue",
    "Compute",
    "Memory Cache",
    "CDN",
    "File Storage",
    "Relational DB",
    "NoSQL DB"
  ],
  "survivalTimeSeconds": 420
}
```

- **Prompt Template (conceptual)**:

> The player's system crashed after [TIME] seconds. Their architecture: [SERVICES]. Act as a Senior Site Reliability Engineer. Give a 3-sentence brutal but educational post-mortem on why this architecture failed and how to fix it.

- **Response (JSON)**:

```json
{
  "postmortem": "Three-sentence analysis here."
}
```

The backend should:

- Enforce a short length (e.g. via prompt instructions).
- Trim any extra whitespace.

---

## 4. Frontend Integration

The existing game logic lives in `game.js` and `src/`. We are **not** rewriting core mechanics; we are adding glue code and UI to talk to the backend.

### 4.1 Board State Helper

Add a helper in `game.js` (or appropriate central game logic file):

```js
function getBoardState() {
  // Return an array of service names currently active on the board.
  // Example:
  // [
  //   "Firewall",
  //   "API Gateway",
  //   "Load Balancer",
  //   "Message Queue",
  //   "Compute",
  //   "Memory Cache",
  //   "CDN",
  //   "File Storage",
  //   "Relational DB",
  //   "NoSQL DB"
  // ]
}
```

This should read from the game’s internal data structures (entities / nodes) and:

- Deduplicate service types if necessary, or
- Optionally include counts (future enhancement).

### 4.2 AI Saboteur Hook

Locate the existing **random event / traffic burst** logic (e.g. timers that fire every N seconds).

Change behavior:

- **Every 60 seconds** (configurable), instead of generating a random event:
  1. Call `getBoardState()` to collect current services.
  2. `fetch('http://localhost:3000/api/sabotage', { method: 'POST', body: JSON.stringify({ services }), headers: { 'Content-Type': 'application/json' } })`.
  3. Parse the JSON response `{ trafficType, intensity, saboteurMessage }`.
  4. Map this into the game’s existing event/burst system:
     - Convert `trafficType` into whatever internal enum/type the game expects.
     - Scale traffic magnitude based on `intensity`.
  5. Display `saboteurMessage`:
     - As a prominent toast/banner at the top of the screen.
     - Styled using glitch red / neon cyan.

Requirements:

- If the request fails or times out:
  - Fallback to a simple deterministic event (e.g. small malicious spike).
  - Show a neutral message like “AI Saboteur offline – using fallback scenario.”

### 4.3 AI Post-Mortem Hook

Find the `gameOver()` (or equivalent) function.

Extend behavior:

1. When game over is triggered:
   - Call `getBoardState()` one last time.
   - Compute or read `survivalTimeSeconds` from existing state.
2. Show a loading state in the Game Over UI:
   - Text: “Generating AI Post-Mortem…”
   - Optional animated scanning bar.
3. Fire a `fetch('/api/postmortem', { ... })` call to the backend with `{ services, survivalTimeSeconds }`.
4. On success:
   - Replace the default Game Over message with `postmortem`.
5. On failure:
   - Show a fallback human-written tip summary from the original game (or a shorter generic message).

---

## 5. Running the System Locally

### 5.1 One-Time Setup

From the repo root:

```bash
# 1. Install backend dependencies
npm install

# 2. Create backend/.env with AWS credentials and config
cp backend/.env.example backend/.env   # (create example if needed)
# Then edit backend/.env with real values
```

Ensure AWS credentials you use have permission to call Bedrock runtime.

### 5.2 Start Backend

```bash
node backend/server.js
```

The server should:

- Listen on `http://localhost:3000`.
- Enable CORS for `http://localhost:*.`

### 5.3 Run Frontend

Option A (simple, no dev server):

- Open `index.html` directly in a modern browser.
- Ensure any `fetch` URLs hit `http://localhost:3000/...`.

Option B (recommended static server):

```bash
npx serve .    # or any simple static file server
```

Then open the printed URL in the browser (e.g. `http://localhost:5000`).

---

## 6. Behavioral Goals & Constraints

- **Do NOT** rewrite or break:
  - Three.js rendering of the board.
  - Core simulation rules (traffic routing, scoring, health, economy).
- **Do**:
  - Layer AI events on top of existing mechanics.
  - Use AI to choose *when/how* to stress the system, not to replace the simulation itself.
  - Focus on making the **post-mortem experience** polished, fast, and readable.

---

## 7. Implementation Checklist

Use this as a step-by-step checklist as we build:

1. **Branding & UI**
   - [ ] Rename titles/headings to **CodeRonin-SRE Arena**.
   - [ ] Apply cyberpunk theme from `design.md`.
   - [ ] Add “Powered by AWS Bedrock” badge.

2. **Backend**
   - [ ] Create `backend/server.js` with Express + CORS.
   - [ ] Wire up AWS Bedrock client.
   - [ ] Implement `/api/sabotage` endpoint.
   - [ ] Implement `/api/postmortem` endpoint.

3. **Frontend Integration**
   - [ ] Implement `getBoardState()` helper.
   - [ ] Replace random event logic with AI sabotage hook.
   - [ ] Integrate AI post-mortem into `gameOver()` flow.
   - [ ] Add UI components for saboteur toasts and post-mortem display.

4. **Testing & Polish**
   - [ ] Test with Bedrock connected (happy path).
   - [ ] Test with Bedrock offline (fallback behavior).
   - [ ] Adjust difficulty / intensity mapping to feel fun but punishing.

Once all boxes above are checked, the project is considered fully converted from **Server Survival** into **CodeRonin-SRE Arena**.

---

## 8. Feature Pruning & Simplification (CRITICAL)

**Context:** The original game has many features (Sandbox mode, a wide set of node types, complex finance tables, auto-repairs, degradation, random events, etc.). For a hackathon demo, we want to **spotlight the AI Saboteur + AI Post-Mortem** while still letting users design realistic architectures with all the tools.

**Rules:**

- **Keep all node types/tools** (Firewall, API Gateway, Load Balancer, Queue, Compute, Cache, CDN, Storage, SQL DB, NoSQL DB).
- **Do not delete core simulation code** in `src/` or `game.js`.
- Prefer **toggling off complex mechanics via config** and **hiding heavy UI panels**, rather than removing logic.

### 8.1 Toolbar (Nodes) – Keep Everything

We want the player to have access to the full cloud toolbox.

- **Action:** In `index.html`, keep the entire toolbar of tools visible:
  - `Select`, `Link`, `Demolish`
  - `Firewall` (waf)
  - `API Gateway` (apigw)
  - `Load Balancer` (alb)
  - `Queue` / `Message Queue` (sqs)
  - `Compute` (you may relabel it visually as `API Server` if you like)
  - `Cache` / `Memory Cache` (cache)
  - `CDN` (cdn)
  - `Storage` / `File Storage` (s3)
  - `SQL DB` / `Relational DB` (db)
  - `NoSQL DB` (nosql)

You can tweak button labels for clarity, but **do not hide or remove any of these tools**.

### 8.2 Hide Complex UI Panels

The right side of the screen has large tables for "Service Health" and "Finances" which are powerful but visually heavy.

- **Action:** In `index.html`, find the right-side UI panels for:
  - `Finances`
  - `Service Health`
- **Hide them** using CSS (e.g. inline `style="display:none;"` or a class).

For the hackathon:

- The player should mainly see the **top-left panel**:
  - Budget
  - Reputation
  - Elapsed Time

This is enough to understand success/failure at a glance during the demo.

### 8.3 Lock Game Mode to "Survival"

We want a single, clear loop:

- Traffic comes in.
- Player builds a minimal architecture.
- AI Saboteur periodically attacks.
- AI Post-Mortem explains the failure at the end.

To avoid mode confusion:

- **Action:** Hide the "Sandbox" toggle or UI panel.
- The game should effectively **start and stay in the Survival/Challenge mode**.
- Any code paths for Sandbox can remain in JS, but the user shouldn’t see or click them in the UI.

### 8.4 Turn Off Overly Complex Mechanics via Config

Most of the “extra chaos” is controlled via flags and sections in `CONFIG.survival` in `src/config.js`. To simplify behavior without breaking code:

- In `CONFIG.survival`:
  - Set `degradation.enabled = false` to disable service health decay / repair mechanics.
  - Set `trafficShift.enabled = false` to disable periodic traffic mix shifts.
  - Set `randomEvents.enabled = false` so AI Saboteur becomes the primary “event” system (you can still reuse its UI, but not the random types).
  - Optionally set `maliciousSpike.enabled = false` if you want most malicious behavior to come from AI-driven events instead of built-in spikes.
  - Optionally set `upkeepScaling.enabled = false` to keep upkeep costs flat over time.
  - Keep `rpsAcceleration` but consider slimming milestones (e.g. only 2–3) if gameplay feels too chaotic.

This preserves all the core routing/economy logic, but removes layers of shifting rules that are hard to explain in a short demo.

### 8.5 AI Prompts with Full Architecture

Because we keep all tools, the board state that goes to AWS Bedrock can include the full set of services:

```text
["Firewall", "API Gateway", "Load Balancer", "Message Queue", "Compute", "Memory Cache", "CDN", "File Storage", "Relational DB", "NoSQL DB"]
```

Prompt guidelines:

- Treat this list as the **canonical vocabulary** for architectures.
- Encourage the model (via prompt) to reference these exact service names when:
  - Calling out weak spots.
  - Suggesting improvements in the post-mortem.

This gives you richer, more realistic architectures while still keeping the underlying mechanics understandable for the hackathon audience.

---

## 9. System Design "Interview" Mode (AI Mentor)

**Context:** To make this a true educational tool, we frame gameplay as a live **System Design Interview**. The player is given a scenario with specific constraints. Every 30 seconds, an **AWS Bedrock AI Mentor** evaluates their architecture against the scenario and gives a **single, progressive hint**.

### 9.1 Hardcoded Scenarios (Frontend State)

In the main frontend JS file (`game.js`), define a set of detailed system design scenarios and select one as active on load:

```js
const SCENARIOS = [
  {
    id: "instagram_feed",
    title: "Design Instagram News Feed",
    description:
      "System must serve 100,000 Reads Per Second (RPS) with <200ms latency. Users upload photos (STATIC files), but mostly scroll feeds (READ database). High availability is preferred. Media must load instantly globally.",
    targetTraffic: { read: 80, static: 20, write: 0 }
  },
  {
    id: "ecommerce_flash_sale",
    title: "E-Commerce Flash Sale",
    description:
      "Handle massive, sudden 50x traffic bursts. Traffic is 60% WRITE (users placing orders) and 40% READ (checking inventory). You cannot drop a single order, and database locks must be avoided. Strict consistency required.",
    targetTraffic: { read: 40, static: 0, write: 60 }
  },
  {
    id: "whatsapp_chat",
    title: "Global Chat Application",
    description:
      "System requires millions of concurrent WebSocket connections. High WRITE volume (sending messages) and high READ volume (fetching history). Needs ultra-fast, unstructured data storage.",
    targetTraffic: { read: 50, static: 0, write: 50 }
  }
];

// For the hackathon demo, default to the Flash Sale scenario.
let activeScenario = SCENARIOS[1];
```

Usage:

- On game start, use `activeScenario` to populate UI and to send to the Mentor backend.
- Future extensions can allow switching scenarios via a dropdown.

### 9.2 Mentor UI Panel (HTML/CSS)

Add a cyberpunk-styled **Mission Brief & Mentor** panel to `index.html`, ideally near the top-right cluster:

```html
<div id="mentor-panel" style="position: absolute; top: 20px; right: 20px; width: 320px; background: rgba(5,5,5,0.85); border: 1px solid #00f3ff; padding: 15px; border-radius: 4px; z-index: 100; font-family: monospace; color: #fff;">
  <h3 style="color: #00f3ff; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
    <span style="animation: pulse 2s infinite;">🟢</span> MISSION: <span id="mission-title"></span>
  </h3>
  <p id="mission-desc" style="font-size: 12px; color: #aaa; margin-bottom: 15px;"></p>
  <div style="border-top: 1px dashed #333; padding-top: 10px;">
    <span style="color: #00f3ff; font-weight: bold; font-size: 12px;">&gt; AI MENTOR:</span>
    <p id="mentor-hint" style="font-size: 13px; color: #fff; margin: 5px 0 0 0;">Scanning architecture...</p>
  </div>
</div>
```

JS responsibilities (in `game.js`):

- On load, set:
  - `document.getElementById("mission-title").textContent = activeScenario.title;`
  - `document.getElementById("mission-desc").textContent = activeScenario.description;`
- Update `#mentor-hint` whenever a new hint is received.
- Optionally, add CSS keyframes for `pulse` and a small glitch/typing effect on hint updates.

### 9.3 Backend Mentor Endpoint (`/api/mentor`)

In `backend/server.js`, add a new POST endpoint that evaluates the current board against the active scenario.

- **Endpoint:** `POST /api/mentor`
- **Request body (JSON):**

```json
{
  "services": ["Firewall", "Compute"],
  "scenario": {
    "title": "E-Commerce Flash Sale",
    "description": "Handle massive, sudden 50x traffic bursts..."
  }
}
```

**Bedrock call (Claude 3 Haiku recommended):**

- **System prompt:**

> You are an expert Staff Engineer conducting a System Design Interview. The candidate is solving this scenario: '{scenario.title}: {scenario.description}'.  
> Their current architecture board contains: [{services}].  
> YOUR TASK: Analyze what they have built so far against the scenario constraints. Identify the SINGLE most critical missing component for the NEXT logical step. Do not list everything missing. Give ONE progressive hint. Keep your response to a maximum of 2 short, punchy sentences. Return ONLY valid JSON in this format: { "hint": "Your progressive hint here." }

- **Expected response JSON:**

```json
{
  "hint": "Your progressive hint here."
}
```

- **Fallback on error:**

```json
{
  "hint": "Mentor connection lost. Trust your engineering instincts."
}
```

The backend should:

- Parse and validate the model output.
- Fall back to the static hint if parsing fails or Bedrock errors.

### 9.4 Frontend Mentor Hook (Polling)

In `game.js`, integrate the Mentor as a periodic evaluator:

- Add a timer in the main game loop or a separate `updateMentor(dt)` function:
  - Every **30 seconds of game time** (not wall-clock), call:

```js
async function requestMentorHint() {
  const services = getBoardState(); // uses the full architecture vocabulary

  try {
    const res = await fetch("http://localhost:3000/api/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        services,
        scenario: {
          title: activeScenario.title,
          description: activeScenario.description
        }
      })
    });

    const data = await res.json();
    const hintEl = document.getElementById("mentor-hint");
    if (hintEl && data.hint) {
      // Optional: glitch/typing effect around this assignment
      hintEl.textContent = data.hint;
    }
  } catch (e) {
    const hintEl = document.getElementById("mentor-hint");
    if (hintEl) {
      hintEl.textContent =
        "Mentor connection lost. Trust your engineering instincts.";
    }
  }
}
```

- Hook this into the game loop:
  - Track an `mentorTimer` (in seconds) and call `requestMentorHint()` each time it crosses 30 seconds, then reset.

Visual polish:

- Add a short glitch/typing animation when `#mentor-hint` changes to reinforce the “live comms” feel.
- Optionally sync a subtle sound with each new hint using `SoundService`.


