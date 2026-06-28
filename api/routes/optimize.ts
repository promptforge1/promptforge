import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { HttpClient } from "../lib/http";
import { env } from "../lib/env";

const openai = new HttpClient("https://api.openai.com/v1", {
  headers: { Authorization: `Bearer ${env.openaiApiKey}` },
});

export const optimizeRouter = createRouter({
  prompt: publicQuery
    .input(
      z.object({
        prompt: z.string().min(1, "Prompt is required"),
        model: z.string().min(1, "Model is required"),
      }),
    )
    .mutation(async ({ input }) => {
      if (!env.openaiApiKey) {
        throw new Error("OPENAI_API_KEY is not configured");
      }

      const response = await openai.post<{
        choices: { message: { content: string } }[];
      }>("/chat/completions", {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert prompt engineer. Optimize the user's prompt for ${input.model}. Return ONLY the optimized prompt, no markdown, no explanation.`,
          },
          {
            role: "user",
            content: input.prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      });

      const optimized = response.choices[0]?.message?.content?.trim();
      if (!optimized) {
        throw new Error("No response from OpenAI");
      }

      return { optimized };
    }),
});
