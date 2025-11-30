import express from "express";
import { Anthropic } from "@anthropic-ai/sdk";

const router = express.Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST /api/ai/generate
router.post("/generate", async (req, res) => {
  try {
    const { userPrompt, systemPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "userPrompt is required" });
    }

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt || "You are a helpful assistant.",
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return res.json({ content: content.text });
    }

    res.status(500).json({ error: "Unexpected response format" });
  } catch (error) {
    console.error("AI Generation error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

export default router;
