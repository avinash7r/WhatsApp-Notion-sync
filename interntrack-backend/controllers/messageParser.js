import axios from "axios";
import addToNotionDB from "../services/notionService.js";

const OLLAMA_API_URL = process.env.OLLAMA_API_URL;

const parseMessage = async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Send user message to Ollama API with streaming response
    const response = await axios.post(
      OLLAMA_API_URL,
      {
        model: "mistral",
        messages: [
          {
            role: "user",
            content: `You're an AI that extracts structured data from WhatsApp messages related to internship or placement opportunities for students.

          Instructions:
          - Only respond with structured JSON if the message is clearly about an internship, placement, or campus recruitment opportunity.
          - If the message is not related to internships/placements, or if less than 80% of the following information is present (company, event_type, date, time, link, action), respond with: {"skip": true}
          - For the "action" field, summarize the main actions or instructions in 3 to 4 concise bullet points at most. If there are more, select only the most important ones.
          - **Do not assume, infer, or hallucinate any information that is not explicitly present in the message. If a field is missing or unclear, leave it blank or use "Not Provided".**
          - Format your response as JSON with these keys: company, event_type, date, time, link, action.

          Message: "${userMessage}"`,
          },
        ],
      },
      { responseType: "stream" }
    );

    let fullContent = "";
    // Listen for data chunks from the streaming response
    response.data.on("data", (chunk) => {
      // Each chunk is a JSON line
      const lines = chunk.toString().split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          // Concatenate the content from each chunk
          if (parsed.message && parsed.message.content) {
            fullContent += parsed.message.content;
          }
        } catch (e) {
          // Ignore malformed lines
        }
      }
    });

    // When the stream ends, process the full content
    response.data.on("end", async () => {
      let structured;
      try {
        // Parse the concatenated content as JSON
        structured = JSON.parse(fullContent);
      } catch (e) {
        structured = { raw: fullContent };
      }
      console.log("📬 AI parsed Successfully");
      // If the message should be skipped, respond accordingly
      if (structured.skip === true) {
        console.log("Skipping message:", structured);
        return res.json({
          success: true,
          skipped: true,
          reason: "Message not relevant or incomplete.",
        });
      }
      console.log("Trying to add data into Notion");
      // Add the structured data to Notion database
      try {
        await addToNotionDB(structured);
      } catch (e) {
        console.error("Failed to add into Notion:", e.message);
      }
      console.log("Successfully added into Notion");
      // Respond with the structured result
      res.json({ success: true, result: structured });
    });

    // Handle streaming errors
    response.data.on("error", (err) => {
      console.error("Ollama stream error:", err);
      res.status(500).json({ success: false, error: "Stream error" });
    });
  } catch (error) {
    // Handle errors from the Ollama API request
    console.error("Ollama error:", error.message);
    if (error.response) {
      console.error("Ollama error response data:", error.response.data);
    }
    res.status(500).json({ success: false, error: "LLM error" });
  }
};

export default parseMessage;
