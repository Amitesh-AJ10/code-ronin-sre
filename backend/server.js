const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Bedrock Client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const MODEL_ID =
  process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

// Helper to call Bedrock
async function callBedrock(systemPrompt, userPrompt) {
  const startTime = Date.now();
  console.log(`[Bedrock Request] ${new Date().toISOString()} - Model: ${MODEL_ID}`);

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 500,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.7,
  };

  try {
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const resultText = responseBody.content[0].text;
    const duration = Date.now() - startTime;

    console.log(`[Bedrock Success] Latency: ${duration}ms`);

    // Attempt to parse JSON from the text if the model returned it wrapped in code blocks or with preamble
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn("[JSON Parse Warning] Regex match failed to parse, falling back to raw text.");
      }
    }
    return JSON.parse(resultText);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Bedrock Error] Latency: ${duration}ms - Error:`, error.name || error.message);
    throw error;
  }
}

// AI Saboteur – Intelligent SRE Attacks
app.post("/api/sabotage", async (req, res) => {
  const { services = [] } = req.body || {};

  const systemPrompt = `You are an AI Saboteur attacking a cloud architecture.
  Identify the weakest SRE link in the player's services.
  Generate a JSON attack payload. Return ONLY JSON in this format:
  { "trafficType": "MALICIOUS" | "READ" | "WRITE", "intensity": 30-100, "saboteurMessage": "Taunt about why their specific architecture is weak." }`;

  const userPrompt = `Current board services: [${services.join(", ")}]. Determine the best attack vector.`;

  try {
    const sabotage = await callBedrock(systemPrompt, userPrompt);
    return res.json(sabotage);
  } catch (error) {
    // Fallback for demo stability
    return res.json({
      trafficType: "MALICIOUS",
      intensity: 50,
      saboteurMessage: "AI Saboteur connection flickering... utilizing fallback DDoS vector.",
    });
  }
});

// AI Post-Mortem – brutal but educational analysis
app.post("/api/postmortem", async (req, res) => {
  const { services = [], survivalTimeSeconds = 0 } = req.body || {};

  const systemPrompt = `You are a Senior Site Reliability Engineer.
  Analyze the failed architecture and survival time.
  Give a 3-sentence brutal but educational post-mortem.
  Return ONLY JSON in this format: { "postmortem": "Your analysis here." }`;

  const userPrompt = `Architecture: [${services.join(", ")}]. Survival Time: ${Math.round(survivalTimeSeconds)} seconds. Why did it fail?`;

  try {
    const postmortem = await callBedrock(systemPrompt, userPrompt);
    return res.json(postmortem);
  } catch (error) {
    return res.json({
      postmortem: `Your system lasted ${Math.round(survivalTimeSeconds)} seconds. Under heavy load, the lack of redundancy and proper scaling caused a cascading failure. Next time, focus on decoupling and isolation.`,
    });
  }
});

// AI Mentor – progressive hint for current scenario
app.post("/api/mentor", async (req, res) => {
  const { services = [], scenario = {} } = req.body || {};

  const systemPrompt = `You are a Staff Engineer conducting a System Design Interview.
  Scenario: "${scenario.title}: ${scenario.description}".
  Candidate's built services: [${services.join(", ")}].
  Analyze design flaws relative to the scenario.
  Give ONE specific, progressive hint. Max 2 short sentences.
  Return ONLY JSON in this format: { "hint": "Your hint here." }`;

  const userPrompt = "Provide the single most critical hint for the next step of this design.";

  try {
    const mentor = await callBedrock(systemPrompt, userPrompt);
    return res.json(mentor);
  } catch (error) {
    return res.json({
      hint: "Mentor connection unstable. Focus on handling latency spikes and data consistency for this scenario.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`CodeRonin-SRE Production AI backend listening on http://localhost:${PORT}`);
});

