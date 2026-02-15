import * as fs from 'fs';
import * as path from 'path';
import { AgentState, AgentRole, Message, Tool, ToolCall } from './types';

export class Agent {
    private state: AgentState;
    private tools: Map<string, Tool>;
    private attemptCounter: number = 0; // To simulate improvement

    constructor(mission: string) {
        this.state = {
            files: new Map(),
            terminalOutput: [],
            plan: [],
            mission,
            history: []
        };
        this.tools = new Map();
        this.registerCoreTools();
    }

    private registerCoreTools() {
        this.registerTool({
            name: 'write_file',
            description: 'Writes content to a file in the virtual file system',
            execute: async ({ path: filePath, content }: { path: string, content: string }) => {
                this.state.files.set(filePath, content);

                // Write to physical disk for demonstration
                const outputPath = path.join(process.cwd(), 'output', filePath);

                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                fs.writeFileSync(outputPath, content);

                console.log(`[Tool] Wrote to ${filePath} (saved to output/${filePath})`);
                return `File ${filePath} written successfully.`;
            }
        });

        this.registerTool({
            name: 'read_file',
            description: 'Reads content from a file',
            execute: async ({ path }: { path: string }) => {
                const content = this.state.files.get(path);
                if (!content) throw new Error(`File ${path} not found`);
                return content;
            }
        });

        // Add more tools here (exec_command, etc.)
    }

    public registerTool(tool: Tool) {
        this.tools.set(tool.name, tool);
    }

    public async run() {
        console.log(`Starting mission: ${this.state.mission}`);

        // 1. ARCHITECT Phase: Create a plan
        await this.runRole('ARCHITECT');

        // 2. DEVELOPER + CRITIC Phase: Execute the plan with quality control
        await this.runDevelopmentLoop();
    }

    private async runDevelopmentLoop() {
        for (const step of this.state.plan) {
            if (step.status === 'pending') {
                console.log(`\n--- Step: ${step.description} ---`);

                let attempts = 0;
                let approved = false;

                while (!approved && attempts < 3) {
                    attempts++;
                    console.log(`\n[Attempt ${attempts}] Developer is working...`);

                    // Developer executes the task
                    // Context includes the attempt number to simulate "learning"
                    await this.runRole('DEVELOPER', `${step.description} (Attempt ${attempts})`);

                    // Critic reviews the work
                    console.log(`\n[Critic] Reviewing work...`);
                    const feedback = await this.runRole('CRITIC', step.description);

                    if (feedback === 'APPROVED') {
                        console.log(`[Critic] APPROVED. Moving to next step.`);
                        approved = true;
                        step.status = 'completed';
                    } else {
                        console.log(`[Critic] REJECTED. Feedback: ${feedback}`);
                        // In a real LLM, we would add this feedback to the context for the next developer run.
                    }
                }

                if (!approved) {
                    console.error(`[System] Step failed after ${attempts} attempts.`);
                    step.status = 'failed';
                }
            }
        }
    }

    private async runRole(role: AgentRole, context?: string): Promise<string> {
        console.log(`[Role] Switching to ${role}...`);

        // SIMULATION MOCKS
        if (role === 'ARCHITECT') {
            this.state.plan.push({
                id: '1',
                description: 'Create main app file with Golden Stack',
                status: 'pending',
                role: 'DEVELOPER'
            });
            console.log(`[Architect] logic plan created.`);
            return "Plan created";
        }

        if (role === 'DEVELOPER') {
            const toolName = 'write_file';

            // Simulate evolution:
            // Attempt 1: Basic code
            // Attempt 2: Premium code (Golden Stack)
            const isPremium = context?.includes("Attempt 2") || context?.includes("Attempt 3");

            const content = isPremium
                ? '// PREMIUM CODE\nimport { Button } from "@/components/ui/button";\nexport default function App() { return <Button>Click me</Button> }'
                : '// BASIC CODE\nconsole.log("Hello World");';

            const args = { path: 'index.tsx', content };
            await this.executeToolCall({ id: 'call_1', name: toolName, args });
            return "Task executed";
        }

        if (role === 'CRITIC') {
            // Mocking the Critic's brain
            // If the file contains "Button" (Shadcn), we approve.
            // If it's just console.log, we reject.
            const fileContent = this.state.files.get('index.tsx') || "";

            if (fileContent.includes("Button")) {
                return 'APPROVED';
            } else {
                return 'REJECTED: Code is too basic. Use Shadcn/UI components.';
            }
        }

        return "Unknown role execution";
    }

    private async executeToolCall(call: ToolCall) {
        const tool = this.tools.get(call.name);
        if (!tool) throw new Error(`Tool ${call.name} not found`);

        try {
            const result = await tool.execute(call.args, this.state);
            this.state.history.push({
                role: 'assistant',
                content: `Tool ${call.name} output: ${result}`
            });
        } catch (error: any) {
            console.error(`Tool execution failed: ${error.message}`);
        }
    }
}
