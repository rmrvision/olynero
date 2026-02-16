import { z } from "zod";

export const ProjectSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    isPublic: z.boolean().optional(),
});

export const FileSchema = z.object({
    path: z.string()
        .min(1)
        .max(500)
        .refine((path) => !path.includes(".."), { message: "Path validation error: Directory traversal detected" })
        .refine((path) => !path.startsWith("/"), { message: "Path validation error: Absolute paths not allowed" })
        .refine((path) => !path.includes("\0"), { message: "Path validation error: Null bytes detected" }),
    content: z.string().max(1024 * 1024 * 5, "File size limit exceeded (5MB)"), // 5MB limit
});

export const AgentMessageSchema = z.object({
    projectId: z.string().cuid(),
    messages: z.array(z.any()), // flexible for AI SDK messages
});
