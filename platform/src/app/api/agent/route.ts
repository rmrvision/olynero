import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
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

    // 1. Get Project Context
    // We fetch all file paths to give the AI structure awareness
    // We only fetch content for files potentially relevant (or assume small project fits all content for now)
    // For MVP, we'll fetch all content. For scale, we'd need RAG or smarter selection.
    const files = await db.file.findMany({
        where: {
            projectId: projectId,
        },
        select: {
            path: true,
            content: true,
        }
    });

    const fileContext = files.map(f => `File: ${f.path}\nContent:\n${f.content}`).join("\n\n");

    const systemPrompt = `
You are an expert Full Stack React & Node.js Developer acting as the intelligence for a web-based IDE.
Your task is to help the user build, debug, and modify their project.

Current Application Context:
${fileContext}

Capabilities:
- You verify your code changes before submitting.
- You can create, update, and delete files using the provided tools.
- When asked to modify code, ALWAYS return the COMPLETE new file content using the 'updateFile' tool. Do not just return snippets or diffs unless asked for unrelated explanations.
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
        messages,
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
            }
        } as any,
    });

    return result.toTextStreamResponse();
}
