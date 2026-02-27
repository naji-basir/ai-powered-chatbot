import express from "express";
const router = express.Router();
import { chatController } from "../controllers/chat.controller";
router
  .route("/")
  .post(chatController.getResponse)
  .get(chatController.helloWorld);

router
  .route("/:conversationId")
  .get(chatController.getConversation)
  .delete(chatController.clearConversation);

export default router;
