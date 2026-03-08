const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple helper to log incoming payloads in dev
function logRequest(name, body) {
  // eslint-disable-next-line no-console
  console.log(`[${name}]`, JSON.stringify(body, null, 2));
}

// Stub: AI Saboteur – returns a fake attack payload
app.post("/api/sabotage", (req, res) => {
  const { services = [] } = req.body || {};
  logRequest("sabotage", { services });

  const trafficTypes = ["MALICIOUS", "READ", "WRITE"];
  const trafficType =
    trafficTypes[Math.floor(Math.random() * trafficTypes.length)];
  const intensity = 30 + Math.floor(Math.random() * 50); // 30–80

  const messageBase =
    services && services.length
      ? `Your architecture is leaning on ${services.join(", ")}.`
      : "You have almost no protection configured.";

  return res.json({
    trafficType,
    intensity,
    saboteurMessage: `${messageBase} Let's see if it can handle this spike.`,
  });
});

// Stub: AI Post-Mortem – short static analysis
app.post("/api/postmortem", (req, res) => {
  const { services = [], survivalTimeSeconds = 0 } = req.body || {};
  logRequest("postmortem", { services, survivalTimeSeconds });

  const time = Math.round(survivalTimeSeconds);
  const servicesText = services.length ? services.join(", ") : "no services";

  return res.json({
    postmortem: `Your system lasted ${time} seconds with ${servicesText}. Capacity and failure modes were never tuned for sustained load – under real pressure, queues filled, databases locked, and everything toppled at once.`,
  });
});

// Stub: AI Mentor – progressive hint for current scenario
app.post("/api/mentor", (req, res) => {
  const { services = [], scenario = {} } = req.body || {};
  logRequest("mentor", { services, scenario });

  const title = scenario.title || "Unnamed Scenario";
  const hasQueue = services.includes("Message Queue");
  const hasCache = services.includes("Memory Cache");

  let hint;
  if (!hasQueue) {
    hint =
      "You have no buffering layer yet—introduce a Message Queue between ingress and compute to survive bursts.";
  } else if (!hasCache) {
    hint =
      "Reads are still hammering your databases—add a Memory Cache between compute and storage to absorb hot traffic.";
  } else {
    hint =
      "Your next bottleneck is data durability and replication—think about how this design for '" +
      title +
      "' survives a full AZ failure.";
  }

  return res.json({ hint });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`CodeRonin-SRE backend listening on http://localhost:${PORT}`);
});

