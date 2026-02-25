import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/aiChatBot.route";

dotenv.config();
const port = process.env.PORT || 3008;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/chat", router);

app.listen(port, () => {
  console.log(`Server is runnig on http://localhost:${port}`);
});

// Runnung a local chatbot server
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const response = await axios.post("http://localhost:11434/api/generate", {
//       model: "llama3.2",
//       prompt: message,
//       stream: false,
//     });

//     res.json({ reply: response.data.response });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something failed" });
//   }
// });
