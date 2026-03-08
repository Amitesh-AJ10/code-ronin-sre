# CodeRonin-SRE: AI Logic & AWS Integration Plan

This document outlines the steps to replace the mock API endpoints in `backend/server.js` with real **AWS Bedrock** AI logic and provides instructions for deploying the system using **AWS Amplify**.

---

## 1. AWS Bedrock Integration

### Overview
We will use the **Claude 3 Haiku** model on Bedrock for its balance of speed and low cost, making it ideal for the real-time "AI Mentor" and "AI Saboteur" features.

### Required Package Changes
You need to install the AWS SDK for Bedrock Runtime.
```bash
npm install @aws-sdk/client-bedrock-runtime
```

### Files to Modify
#### `backend/server.js`
- **Import Bedrock Client**: Add `const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");`.
- **Initialize Client**: Initialize the client using credentials from environment variables (`.env`).
- **Implement Actual Logic**:
    - **`/api/sabotage`**: Replace random traffic logic with a prompt that analyzes the current `services` list and identifies the "weakest link" based on SRE principles.
    - **`/api/postmortem`**: Replace static message with a prompt that analyzes `survivalTimeSeconds` relative to the architecture used.
    - **`/api/mentor`**: Use a comprehensive system prompt that acts as a "Senior Staff Engineer" giving a progressive hint based on the current `scenario` and architecture.

### Implementation Checklist
- [ ] Add `.env` support to `backend/server.js`.
- [ ] Create a `callBedrock` helper function to handle the JSON request/response schema for Claude 3.
- [ ] Define precise System Prompts in `backend/server.js`.

---

## 2. Deployment with AWS Amplify

### Overview
We will deploy the frontend as a static website on **Amplify Hosting** and the backend using an **Amplify Function** (Lambda) or **App Runner**.

### Frontend Deployment (`index.html`, `game.js`, `style.css`)
- **Action**: Connect your GitHub repository to **AWS Amplify Console**.
- **Build Settings**: Since it's a simple static site, the build command can be `npm run build` (if you add a build script that copies files to a `dist` folder) or simply set the base directory to the root.

### Backend Deployment (`backend/`)
- **Option A - Amplify Function (Easiest Integration)**:
    - Use `amplify add function`.
    - Move `backend/server.js` logic into the generated Lambda handler.
    - Set up API Gateway via Amplify (`amplify add api`).
- **Option B - AWS App Runner (Best for existing Express apps)**:
    - Create a `Dockerfile` for the `backend/` folder.
    - Deploy to App Runner, which provides a public URL for your Express server.
    - Update the `fetch()` URLs in `game.js` to point to the App Runner URL.

---

## 3. Specific Function & File Reference

| Area | File | Function | Change Required |
|---|---|---|---|
| **AI Sabotage** | `backend/server.js` | `POST /api/sabotage` | Replace `Math.random()` logic with InvokeModel call. |
| **AI Feedback** | `backend/server.js` | `POST /api/postmortem` | Construct a prompt summarizing the failed architecture. |
| **AI Mentor** | `backend/server.js` | `POST /api/mentor` | Inject the scenario title/description into the Bedrock prompt. |
| **Ingress API** | `game.js` | `callSabotageAPI`, `callMentorAPI`, `callPostmortemAPI` | **CRITICAL**: Change `http://localhost:3000` to the production URL provided by Amplify/App Runner. |
| **Architecture Capture** | `game.js` | `getBoardState()` | Current version is fine, but ensure it includes all active nodes for Bedrock analysis. |

---

## 4. Environment Variables Needed
Ensure these are set in your AWS Amplify / App Runner environment settings:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (e.g., `us-east-1`)
- `BEDROCK_MODEL_ID` (e.g., `anthropic.claude-3-haiku-20240307-v1:0`)

---

## 5. Critical Readiness Notes

### Model Access
Before your code will work, you **must** manually go to the AWS Bedrock Console in your selected region and **Request Access** for the "Claude 3 Haiku" model. Bedrock does not enable models by default.

### CORS & Production
The current `backend/server.js` uses `app.use(cors())` which allows all origins. This is fine for development. For AWS Amplify deployment, ensure the App Runner or Lambda URL is correctly matched in the `game.js` fetch calls.

### API Endpoint Summary
Currently, the API consists of exactly three critical SRE endpoints:
1. `POST /api/sabotage`: Analyzes architecture to generate intelligent SRE attacks.
2. `POST /api/postmortem`: Provides a brutal summary of why the system failed.
3. `POST /api/mentor`: Continuous feedback loop for the candidate during the design phase.
