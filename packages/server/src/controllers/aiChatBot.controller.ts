import type { Request, Response } from "express";
import { Ollama } from "ollama";
import z from "zod";
import { conversationRepository } from "../../repositories/conversations.repository";

// GET response from Ollama API
const client = new Ollama({
  host: "https://ollama.com",
  headers: { Authorization: "Bearer " + process.env.OLLAMA_API_KEY },
});

// schema validation
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long (max 1000 characters)"),
  conversationId: z.uuid(),
});

// Controller function to handle chat requests
export const getResponse = async (req: Request, res: Response) => {
  try {
    // parse request
    const parseResult = chatSchema.safeParse(req.body);

    //error handling
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues });
      return;
    }
    const { prompt, conversationId } = parseResult.data;

    // 1️⃣ get previous messages
    const history = conversationRepository.getConversation(conversationId);
    console.log(history);
    // Create updated messages array
    const updatedHistory = [
      ...history,
      { role: "user" as const, content: prompt },
    ];

    const response = await client.chat({
      model: "gpt-oss:120b",
      // 2️⃣ call model with history
      messages: updatedHistory,
      options: {
        temperature: 0.4,
      },
    });

    // Add assistant's response to history
    const finalHistory = [
      ...updatedHistory,
      { role: "assistant" as const, content: response?.message?.content ?? "" },
    ];

    // 3️⃣ Save updated history
    conversationRepository.saveConversation(conversationId, finalHistory);

    //model response
    return res.json({
      reply: response?.message?.content ?? "No response returned!",
    });
  } catch (error: any) {
    console.error("Ollama error:", error?.response?.data || error.message);
    res.status(500).json({ error: "API request failed" });
  }
};

// A simple test controller
export const helloWorld = (req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
};
