import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

class McpConnection {
    private client: Client | null = null;
    private transport: SSEClientTransport | null = null;
    private isConnected: boolean = false;

    constructor() {
        this.client = new Client(
            {
                name: "code-ronin-client",
                version: "1.0.0",
            },
            {
                capabilities: {
                    // prompts: {},
                    // resources: {}, 
                    // tools: {}
                },
            }
        );
    }

    async connect() {
        if (this.isConnected) return;

        try {
            // NOTE: URL might need to be configurable or proxied via Vite
            this.transport = new SSEClientTransport(new URL("http://localhost:3000/sse"));
            await this.client?.connect(this.transport);
            this.isConnected = true;
            console.log("Connected to MCP Server");
        } catch (error) {
            console.error("Failed to connect to MCP Server:", error);
        }
    }

    async getChaosPatterns() {
        if (!this.isConnected) await this.connect();

        try {
            const result = await this.client?.readResource({ uri: "chaos://patterns" });
            if (result && result.contents && result.contents.length > 0) {
                const content = result.contents[0];
                if ('text' in content) {
                    return JSON.parse(content.text);
                }
            }
            return null;
        } catch (error) {
            console.error("Failed to read chaos patterns:", error);
            // Fallback to local default if server fails?
            return null;
        }
    }
}

export const mcpClient = new McpConnection();
