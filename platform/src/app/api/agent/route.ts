import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, generateId } from "ai";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { saveFile, deleteFileByPath } from "@/lib/files";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

// --- Simple in-memory rate limiter ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20; // max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

function checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(userId);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return false;
    }

    entry.count++;
    return true;
}

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitMap) {
            if (now > entry.resetAt) rateLimitMap.delete(key);
        }
    }, 5 * 60 * 1000);
}

// Whitelist of allowed commands for the AI agent
const ALLOWED_COMMAND_PREFIXES = [
    "npm install", "npm run", "npm init", "npm uninstall",
    "npx", "node", "ls", "cat", "mkdir", "cp", "mv",
    "echo", "pwd", "which", "env",
];

const BLOCKED_PATTERNS = [
    /rm\s+(-[rRf]+\s+)?\//, // rm -rf /
    /rm\s+-[rRf]*\s/, // rm with force/recursive flags
    /curl\s.*\|.*sh/, // curl pipe to shell
    /wget\s.*\|.*sh/,
    /eval\s/,
    /exec\s/,
    />\s*\/etc/,
    /;\s*rm\s/,
    /&&\s*rm\s/,
    /\|\s*sh\b/,
    /\|\s*bash\b/,
];

function isCommandAllowed(command: string): boolean {
    const trimmed = command.trim();

    // Block dangerous patterns
    for (const pattern of BLOCKED_PATTERNS) {
        if (pattern.test(trimmed)) return false;
    }

    // Allow if starts with whitelisted prefix
    const allowed = ALLOWED_COMMAND_PREFIXES.some(prefix =>
        trimmed.startsWith(prefix)
    );

    return allowed;
}

// Validate file path to prevent directory traversal
function isPathSafe(filePath: string): boolean {
    const normalized = filePath.replace(/\\/g, '/');
    if (normalized.includes('..')) return false;
    if (normalized.startsWith('/')) return false;
    if (normalized.includes('\0')) return false;
    return true;
}

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Rate limiting
    if (!checkRateLimit(session.user.id)) {
        return new Response("Too many requests. Please wait a moment.", { status: 429 });
    }

    const { messages, projectId } = await req.json();

    if (!projectId) {
        return new Response("Missing projectId", { status: 400 });
    }

    // Verify project ownership
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: { userId: true },
    });

    if (!project || project.userId !== session.user.id) {
        return new Response("Forbidden", { status: 403 });
    }

    const modelMessages = await convertToModelMessages(messages);

    const filePaths = await db.file.findMany({
        where: { projectId },
        select: { path: true },
    });

    const fileStructure = filePaths.map((f: { path: string }) => f.path).join("\n");

    const systemPrompt = `
You are an expert Full Stack React & Node.js Developer acting as the intelligence for a web-based IDE.
Your task is to help the user build, debug, and modify their project.

Current File Structure:
${fileStructure}

Capabilities:
- You verify your code changes before submitting.
- You can create, update, and delete files.
- You can READ files using the 'readFile' tool. Do not guess content.
- If you suspect a build error, use 'getTerminalLogs' to see what's wrong.
- When asked to modify code, ALWAYS return the COMPLETE new file content using the 'updateFile' tool.
- Be concise. Focus on code.
- If you lack information, ask for it.
- For commands, only use: npm install, npm run, npx, node, ls, mkdir, cp, mv.

Environment:
- Vite + React + TypeScript + TailwindCSS.
- Node.js runtime available (WebContainer).
`;

    const result = streamText({
        model: google("gemini-2.0-flash-exp"),
        system: systemPrompt,
        messages: modelMessages,
        tools: {
            updateFile: {
                description: "Create or update a file in the project. Always provide the full file content.",
                parameters: z.object({
                    path: z.string().describe("The file path (e.g., src/components/Button.tsx). Must not contain '..' or start with '/'."),
                    content: z.string().describe("The comprehensive file content to write."),
                }),
                execute: async ({ path, content }: { path: string; content: string }) => {
                    if (!isPathSafe(path)) {
                        return { error: "Invalid file path" };
                    }
                    await saveFile(projectId, path, content);
                    return { message: `Updated ${path}` };
                },
            },
            createFile: {
                description: "Create a new file.",
                parameters: z.object({
                    path: z.string().describe("The file path."),
                    content: z.string().describe("The file content."),
                }),
                execute: async ({ path, content }: { path: string; content: string }) => {
                    if (!isPathSafe(path)) {
                        return { error: "Invalid file path" };
                    }
                    await saveFile(projectId, path, content);
                    return { message: `Created ${path}` };
                },
            },
            readFile: {
                description: "Read the content of a specific file.",
                parameters: z.object({
                    path: z.string().describe("The file path to read."),
                }),
                execute: async ({ path }: { path: string }) => {
                    const file = await db.file.findFirst({
                        where: { projectId, path },
                    });
                    if (!file) return { error: "File not found" };
                    return { content: file.content };
                },
            },
            runCommand: {
                description: "Run a shell command in the project environment. Only npm, npx, node, ls, mkdir commands are allowed.",
                parameters: z.object({
                    command: z.string().describe("The shell command to execute (e.g., 'npm install date-fns', 'npm run build')."),
                }),
                execute: async ({ command }: { command: string }) => {
                    if (!isCommandAllowed(command)) {
                        return { error: `Command not allowed: ${command}. Only npm, npx, node, ls, mkdir, cp, mv commands are permitted.` };
                    }
                    // Command execution happens client-side in WebContainer
                    return { message: `Executing command: ${command}` };
                },
            },
            getTerminalLogs: {
                description: "Get the recent terminal output logs (stdout/stderr) from the dev server and install processes. Use this to debug errors.",
                parameters: z.object({}),
                execute: async () => {
                    // Client-side intercept provides actual logs
                    return { message: "Terminal logs requested." };
                },
            },
            deleteFile: {
                description: "Delete a file from the project.",
                parameters: z.object({
                    path: z.string().describe("The file path to delete."),
                }),
                execute: async ({ path }: { path: string }) => {
                    if (!isPathSafe(path)) {
                        return { error: "Invalid file path" };
                    }
                    await deleteFileByPath(projectId, path);
                    return { message: `Deleted ${path}` };
                },
            },
        } as any,
    });

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        generateMessageId: generateId,
    });
}
