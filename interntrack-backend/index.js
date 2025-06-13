// index.js

import express from "express";
import dotenv from "dotenv";
import parseMessage from "./controllers/messageParser.js";
import './services/whatsappService.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Queue to handle /parse requests sequentially
const parseQueue = [];
let isProcessing = false;

// Function to process the queue one request at a time
async function processQueue() {
  if (isProcessing || parseQueue.length === 0) return;
  isProcessing = true;
  const { req, res } = parseQueue.shift();
  try {
    // Call the message parser controller
    await parseMessage(req, res);
  } catch (e) {
    // Handle errors and send response
    res.status(500).json({ success: false, error: e.message });
  }
  isProcessing = false;
  processQueue(); // Process next item in the queue
}

// Health check endpoint
app.get("/", (req, res) => {
  res.send("InternTrack AI Backend is Running ✅");
});

// Add incoming /parse requests to the queue
app.post("/parse", (req, res) => {
  parseQueue.push({ req, res });
  processQueue();
});

app.listen(port, () => {
  console.log(`🚀 Server is live at http://localhost:${port}`);
});
