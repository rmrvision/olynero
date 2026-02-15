import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, generateId } from "ai";
import { db } from "@/lib/db"; // Adjust import based on your setup
import { auth } from "@/auth"; // Adjust import based on your setup
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages, projectId } = await req.json();

    if (!projectId) {
        return new Response("Missing projectId", { status: 400 });
    }

    const modelMessages = await convertToModelMessages(messages);

    // 1. Get Project Context
    // We fetch all file paths to give the AI structure awareness
    // We only fetch content for files potentially relevant (or assume small project fits all content for now)
    // OPTIMIZATION: Only fetch paths initially. User 'readFile' tool to get content.
    const filePaths = await db.file.findMany({
        where: {
            projectId: projectId,
        },
        select: {
            path: true,
        }
    });

    // Simple directory structure
    const fileStructure = filePaths.map(f => f.path).join("\n");

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

Environment:
- Vite + React + TypeScript + TailwindCSS.
- Node.js runtime available (WebContainer).
`;

    // 2. Stream Response with Tools
    const result = streamText({
        model: google("gemini-2.0-flash-exp"), // Using a capable model
        system: systemPrompt,
        messages: modelMessages,
        tools: {
            updateFile: {
                description: "Create or update a file in the project. Always provide the full file content.",
                parameters: z.object({
                    path: z.string().describe("The file path (e.g., src/components/Button.tsx). must start with src/ or public/ or be in root."),
                    content: z.string().describe("The comprehensive file content to write."),
                }),
                execute: (async ({ path, content }: { path: string, content: string }) => {
                    return { message: `Updated ${path}` };
                }) as any,
            },
            createFile: {
                description: "Create a new file.",
                parameters: z.object({
                    path: z.string().describe("The file path."),
                    content: z.string().describe("The file content."),
                }),
                execute: (async ({ path, content }: { path: string, content: string }) => {
                    return { message: `Created ${path}` };
                }) as any
            },
            readFile: {
                description: "Read the content of a specific file.",
                parameters: z.object({
                    path: z.string().describe("The file path to read."),
                }),
                execute: async ({ path }: { path: string }) => {
                    const file = await db.file.findFirst({
                        where: {
                            projectId,
                            path
                        }
                    });
                    if (!file) return { error: "File not found" };
                    return { content: file.content };
                }
            },
            runCommand: {
                description: "Run a shell command in the project environment.",
                parameters: z.object({
                    command: z.string().describe("The shell command to execute (e.g., 'npm install date-fns', 'ls -la')."),
                }),
                execute: (async ({ command }: { command: string }) => {
                    return { message: `Executed command: ${command}` };
                }) as any
            },
            getTerminalLogs: {
                description: "Get the recent terminal output logs (stdout/stderr) from the dev server and install processes. Use this to debug errors.",
                parameters: z.object({}),
                // Client-side execution intercept, but we define it here so model knows about it
                execute: (async () => {
                    return { message: "Terminal logs requested." };
                }) as any
            },
            deleteFile: {
                description: "Delete a file from the project.",
                parameters: z.object({
                    path: z.string().describe("The file path to delete."),
                }),
                execute: (async ({ path }: { path: string }) => {
                    return { message: `Deleted ${path}` };
                }) as any
            }
        } as any,
    });

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        generateMessageId: generateId,
    });
}
