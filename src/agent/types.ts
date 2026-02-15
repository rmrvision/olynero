export interface AgentState {
    files: Map<string, string>; // Virtual File System
    terminalOutput: string[];   // History of command outputs
    plan: Step[];               // Current plan of action
    mission: string;           // The original user request
    history: Message[];         // Chat history
}

export interface Step {
    id: string;
    description: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    role: AgentRole;
}

export type AgentRole = 'ARCHITECT' | 'DEVELOPER' | 'COMMANDER' | 'CRITIC';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface Tool {
    name: string;
    description: string;
    execute: (args: any, state: AgentState) => Promise<string>;
}

export interface ToolCall {
    id: string;
    name: string;
    args: any;
}
