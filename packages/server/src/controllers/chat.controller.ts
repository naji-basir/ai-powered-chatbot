import type { Request, Response } from "express";
import z from "zod";
import { chatService } from "../../services/chat.service";

/**
 * Zod schema for validating the request body of the POST /api/chat endpoint.
 * - prompt: must be a non-empty string (trimmed) and at most 1000 characters.
 * - conversationId: must be a valid UUID.
 */
const chatSchema = z.object({
  prompt: z.string().trim().min(1).max(1000),
  conversationId: z.uuid(),
});

/**
 * Zod schema for validating the conversationId route parameter.
 * Used in GET and DELETE /chat/:conversationId.
 */
const conversationParamsSchema = z.object({
  conversationId: z.uuid(),
});

/**
 * Controller object grouping all chat-related route handlers.
 * Each method corresponds to a specific endpoint.
 */
export const chatController = {
  /**
   * Handles POST /chat
   * Receives a user prompt and conversation ID, sends them to the AI service,
   * and returns the AI's reply along with metadata.
   */
  getResponse: async (req: Request, res: Response) => {
    // 1. Validate the request body against the schema
    const bodyResult = chatSchema.safeParse(req.body);

    // If validation fails, return a 400 with detailed issues
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.issues });
    }

    // Extract validated data
    const { prompt, conversationId } = bodyResult.data;

    try {
      // 2. Delegate the actual work to the service layer
      const result = await chatService.sendMessage(prompt, conversationId);

      // 3. Send successful response
      return res.json(result);
    } catch (error: any) {
      // Log the error and return a generic 500 response
      console.error("Controller error:", error.message);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  },

  /**
   * Handles GET /chat/:conversationId
   * Retrieves the full message history for a given conversation.
   */
  getConversation: async function (req: Request, res: Response) {
    // 1. Validate the route parameter (conversationId)
    const paramsResult = conversationParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: "Invalid conversation ID" });
    }
    const { conversationId } = paramsResult.data;

    try {
      // 2. Fetch conversation history from the service
      const history = await chatService.getConversationHistory(conversationId);

      // 3. Return the messages
      res.json({ conversationId, messages: history });
    } catch (error: any) {
      console.error("Error fetching conversation:", error.message);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  },

  /**
   * Handles DELETE /chat/:conversationId
   * Clears all messages from a conversation.
   */
  clearConversation: async function (req: Request, res: Response) {
    // 1. Validate the route parameter
    const paramsResult = conversationParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: "Invalid conversation ID" });
    }
    const { conversationId } = paramsResult.data;

    try {
      // 2. Ask the service to clear the conversation
      const result = await chatService.clearConversation(conversationId);

      // 3. Return a success confirmation
      res.json(result);
    } catch (error: any) {
      console.error("Error clearing conversation:", error.message);
      res.status(500).json({ error: "Failed to clear conversation" });
    }
  },

  /**
   * Simple health-check or test endpoint.
   * Returns a "Hello, World!" message.
   */
  helloWorld: function (req: Request, res: Response) {
    res.json({ message: "Hello, World!" });
  },
};
