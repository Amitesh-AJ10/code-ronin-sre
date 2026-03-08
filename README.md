# CodeRonin-SRE Arena: The AI-Driven System Design Simulator

Welcome to the **CodeRonin-SRE Arena**, a real-time, 3D system design simulator powered by **AWS Bedrock**. Step into the shoes of a Staff Site Reliability Engineer (SRE) and build infrastructure that can survive actual AI-generated architectural attacks.

---

## 🚀 How to Play

### 1. Initialize the Simulation
- When you land on the page, you'll see the **SRE Arena Dashboard**.
- Click **"Start Simulation"** to begin your specific challenge (e.g., *Design Instagram News Feed*).

### 2. The Build Phase (Drag & Drop)
- Identify your target traffic types in the **Mission Panel** (Top-Right).
- **Drag nodes** from the bottom tray onto the 3D grid:
    - **Entry Points**: Firewall (WAF), API Gateway.
    - **Compute**: Specialized nodes for logic processing.
    - **Storage**: SQL Databases, NoSQL, or S3-compatible File Storage.
- **Link Components**: Click the **Link Tool**, tap an origin node, and then a destination node to establish a traffic flow.

### 3. Traffic & Stability
- As you build, **Live Traffic (RPS)** will begin flowing through your system.
- Watch the **System Stability Bar (Top-Left)**. If your design is inefficient or under-provisioned, requests will "drop," and stability will fall.
- **Malicious Traffic**: Periodically, the **AI Saboteur** will strike. If you don't have a Firewall (WAF) or enough capacity, your system will collapse.

### 4. Interactive AI Mentorship
- Every 30 seconds, the **AI Mentor** (Top-Right) scans your architecture.
- It provides semantic, Staff-level hints: *"You lack a caching layer for high read traffic"* or *"Your database is a single point of failure."*

### 5. Termination & The AI Post-Mortem
- The simulation ends if **Stability hits 0%** or you click the **QUIT** button.
- Upon ending, the AI generates a **Post-Mortem Analysis**, providing a brutal and educational report on why your architecture failed and how to improve it.

---

## 🛠️ Simulation Mechanics

| Component | Responsibility |
| :--- | :--- |
| **WAF/Firewall** | Blocks malicious "Saboteur" attacks. |
| **Load Balancer** | Distributes traffic to multiple compute instances. |
| **Compute** | Processes raw requests (Upgradeable!). |
| **Memory Cache** | Offloads repetitive "Read" traffic from databases. |
| **Message Queue** | Buffers "Write" spikes during heavy bursts. |

---

## 📡 Deployment & Setup

To ensure the AI layers (Mentor, Saboteur, Post-Mortem) work, the backend must be running with valid **AWS credentials** and **Claude 3 Haiku** model access.

### 1. AWS Configuration
- Request access to **Claude 3 Haiku** in the **AWS Bedrock Console**.
- Fill out the required **Use Case Details** form in the Bedrock console.
- Create an IAM user with `AmazonBedrockFullAccess`.

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a `.env` file with your credentials:
   ```env
   AWS_REGION=your-region
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
   ```
3. Install dependencies: `npm install`
4. Start the server: `node server.js`

### 3. Frontend Setup
Open `index.html` in your browser. For the best experience, host it locally:
```bash
npx serve .
```

---

*“CodeRonin-SRE Arena is where paper architectures meet the reality of production load.”*
