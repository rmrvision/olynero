import * as fs from 'fs';
import * as path from 'path';
import { AgentState, AgentRole, Message, Tool, ToolCall } from './types';
import { DASHBOARD_TEMPLATE, LANDING_PAGE_TEMPLATE } from './templates';

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

                // Write to physical disk for platform preview
                // For now, let's write to `public/output` so we can potentially iframe it?
                // Or better: just keep it in memory and return it.
                // But for debugging, let's write.
                const outputPath = path.join(process.cwd(), 'public', 'output', filePath);

                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                fs.writeFileSync(outputPath, content);

                console.log(`[Tool] Wrote to ${filePath} (saved to public/output/${filePath})`);
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

        // --- SMART MOCK IMPLEMENTATION ---

        if (role === 'ARCHITECT') {
            const mission = this.state.mission.toLowerCase();
            let plan = [];

            if (mission.includes('create') || mission.includes('build') || mission.includes('new')) {
                // INTENT: CREATE NEW PROJECT
                console.log(`[Architect] Detected intent: CREATE`);
                plan.push({
                    id: '1',
                    description: mission.includes('dashboard') ? 'Create Dashboard Layout' : 'Create Landing Page',
                    status: 'pending' as const,
                    role: 'DEVELOPER' as AgentRole
                });
            } else if (mission.includes('change') || mission.includes('update') || mission.includes('fix')) {
                // INTENT: EDIT EXISTING PROJECT
                console.log(`[Architect] Detected intent: EDIT`);
                plan.push({
                    id: '1',
                    description: `Update App.tsx: ${this.state.mission}`,
                    status: 'pending' as const,
                    role: 'DEVELOPER' as AgentRole
                });
            } else {
                // DEFAULT
                plan.push({
                    id: '1',
                    description: 'Create App.tsx',
                    status: 'pending' as const,
                    role: 'DEVELOPER' as AgentRole
                });
            }

            this.state.plan = plan; // Reset plan for this run
            console.log(`[Architect] Plan created:`, JSON.stringify(plan));
            return "Plan created";
        }

        if (role === 'DEVELOPER') {
            const toolName = 'write_file';
            const stepDescription = context?.split(' (Attempt')[0] || "";

            // Check if we are editing or creating
            const isEdit = stepDescription.includes("Update");
            const targetFile = 'src/App.tsx'; // Default target for mock

            let content = "";

            if (isEdit) {
                // --- EDIT LOGIC ---
                const currentContent = this.state.files.get(targetFile) || "// No content found";
                content = currentContent;

                if (stepDescription.includes("color")) {
                    // Mock color change: replace generic colors with asked color or random
                    if (stepDescription.includes("red")) content = content.replace(/bg-\w+-\d+/g, 'bg-red-500');
                    else if (stepDescription.includes("blue")) content = content.replace(/bg-\w+-\d+/g, 'bg-blue-500');
                    else content = content.replace(/bg-slate-500/g, 'bg-green-500');
                }

                if (stepDescription.includes("title") || stepDescription.includes("text")) {
                    content = content.replace(/<h1>.*<\/h1>/, '<h1>Updated Title</h1>');
                }

                console.log(`[Developer] Edited ${targetFile}`);

                // --- CREATE LOGIC ---
                if (stepDescription.includes("Dashboard")) {
                    content = DASHBOARD_TEMPLATE;
                } else {
                    // Default Landing Page
                    content = LANDING_PAGE_TEMPLATE;
                }
                console.log(`[Developer] Created ${targetFile}`);
            }

            const args = { path: targetFile, content };
            await this.executeToolCall({ id: 'call_1', name: toolName, args });
            return "Task executed";
        }

        if (role === 'CRITIC') {
            const fileContent = this.state.files.get('src/App.tsx') || "";

            // Quality Gate: Must have imports and export default
            if (fileContent.includes("import") && fileContent.includes("export default")) {
                return 'APPROVED';
            } else {
                return 'REJECTED: Missing imports or export default.';
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
