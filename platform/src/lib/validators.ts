import { z } from "zod";

export const AgentRequestSchema = z.object({
    prompt: z.string().min(5, "Prompt must be at least 5 characters long").max(5000),
});

export type AgentRequest = z.infer<typeof AgentRequestSchema>;
