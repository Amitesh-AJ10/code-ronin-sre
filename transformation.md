# CodeRonin-SRE: AWS Bedrock Transformation Plan
**Context:** We are transforming an open-source 3D server survival game (Vanilla JS, Three.js, Tailwind) into an AI-powered SRE training tool called "CodeRonin-SRE" for an AWS Hackathon.
**Deadline:** 5 hours. Keep modifications clean, safe, and isolated.

## The Goal
Replace the game's hardcoded random events with an **AWS Bedrock-powered AI Saboteur** that analyzes the player's architecture and generates targeted attacks or professional Post-Mortems.

---

## Phase 1: The Reskin (Frontend Branding)
**Objective:** Make the UI match the CodeRonin Cyberpunk SRE brand.
1. **Title & Branding:** Search all HTML files. Change `<title>` and main headers from "SERVER SURVIVAL" or "Server Survival" to **"CodeRonin-SRE Arena"**.
2. **Colors:** Modify the Tailwind configuration or inline classes. Change the primary UI accents (blues/greens) to 
- **Theme**: Cyberpunk debug dojo (dark, neon, glassy, glitchy).
- **Base Background**: `#050505` (near‑black).
- **Primary Accent**: `#00F3FF` (neon cyan) – primary CTAs, borders, key highlights.
- **Error / Danger**: `#FF003C` (glitch red) – sabotage alerts, errors, high‑threat states.
3. **AWS Badge:** Add a small "Powered by AWS Bedrock" text/logo in the bottom right corner of the UI.

---

## Phase 2: AWS Backend Integration (The AI Brain)
**Objective:** Since this is Vanilla JS, we cannot put AWS credentials in the frontend. We need a tiny Express server.

1. **Create Backend:** Create a `backend/` folder in the root. Initialize a basic Node.js Express server (`server.js`).
2. **Dependencies:** `npm install express cors dotenv @aws-sdk/client-bedrock-runtime`.
3. **API Routes:** Create two POST endpoints:
   - `/api/sabotage`: Takes an array of active services `['Firewall', 'Load Balancer', 'SQL DB']`. Calls AWS Bedrock (Claude 3 Haiku or Llama 3) with this prompt:
     *"You are an AI Saboteur. The player's cloud architecture contains: [SERVICES]. Identify the weakest link. Generate a JSON payload for an attack: {"trafficType": "MALICIOUS" | "READ" | "WRITE", "intensity": 50, "saboteurMessage": "Your taunting message about their weak architecture."}"*
   - `/api/postmortem`: Triggered on Game Over. Takes the final architecture array and survival time. Calls AWS Bedrock:
     *"The player's system crashed after [TIME] seconds. Their architecture: [SERVICES]. Act as a Senior Site Reliability Engineer. Give a 3-sentence brutal but educational post-mortem on why this architecture failed and how to fix it."*

---

## Phase 3: Frontend AI Hook-in (Game Logic)
**Objective:** Connect the existing game loop to our new AI backend.

1. **State Gathering:** Write a helper function in `js/game.js` (or equivalent main logic file) called `getBoardState()` that returns an array of the names of currently placed services.
2. **The Saboteur Hook:** Find the logic that triggers "Random Events" or "Traffic Bursts". Every 60 seconds, replace the random generation with a `fetch()` call to `http://localhost:3000/api/sabotage`.
   - Parse the response.
   - Trigger the game's native traffic burst using the AI's `trafficType` and `intensity`.
   - Display the `saboteurMessage` in a prominent UI toast/alert at the top of the screen.
3. **The Post-Mortem Hook:** Find the `gameOver()` function.
   - Add a `fetch()` call to `/api/postmortem`.
   - While fetching, show a "Generating AI Post-Mortem..." loading text in the Game Over modal.
   - Replace the generic Game Over text with the AI's response.

---

## Execution Rules for AI Assistant
- Do not attempt to rewrite the Three.js rendering logic. Only touch UI overlays and the main game loop timer.
- Ensure CORS is enabled on the Express backend so the Vanilla JS frontend can talk to it.
- Prioritize getting the `/api/postmortem` hook working first, as it is the easiest to demo for the hackathon video.