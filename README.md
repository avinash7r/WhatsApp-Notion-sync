# 🧠 InternTrack AI Backend

> Seamlessly bridge WhatsApp → LLM → Notion to automate tracking of internship and placement alerts. Built using `Node.js`, `whatsapp-web.js`, `Ollama (Mistral)`, and `Notion SDK`.

---

## 🚀 Overview

**InternTrack AI** is a backend service(for now) that listens to incoming WhatsApp messages (via `whatsapp-web.js`), parses them using a **local LLM** (e.g., Mistral via Ollama), and extracts structured information such as:

- Company Name  
- Event Type (Drive, Test, Interview, etc.)
- Date and Time  
- Important Links or Actions  

The parsed data is then **automatically synced to a Notion database** to help students organize placement details without manual effort.

---

## ✨ Features

- ✅ Real-time WhatsApp message ingestion via [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js)
- 🧠 Local LLM parsing using [Ollama](https://ollama.com/) with models like `mistral`
- 🗂️ Structured data sync to [Notion](https://developers.notion.com/) using `Notion SDK`
- 🔁 Message queueing and retry logic for stability
- 🔐 Environment-based configuration
- 🧪 Easily testable with POST endpoint (`/parse`)
- 🔍 Flexible message listening with detailed message logging

### Example: Filtering for Specific Contacts/Groups

1. **Check `logs/whatsapp_message_log.json`** after receiving messages to find the WhatsApp IDs of your desired contacts or groups.
2. **Edit `services/whatsappService.js`** and add those IDs to the `targetContact` array:
   ```js
   const targetContact = [
     '1234567890@c.us', // Example contact
     '1234567890-1234567890@g.us', // Example group
     // Add more as needed
   ];

   
---

## 🛠️ Stack

- **Backend:** Node.js, Express.js  
- **WhatsApp Integration:** `whatsapp-web.js`  
- **LLM Parsing:** Local LLM (e.g., Mistral) via `Ollama`  
- **Database Sync:** `Notion SDK`  
- **Others:** `dotenv`, `axios`, `cors`, `nodemon`

---

## 📦 Installation & Setup

### 1. Prerequisites

- [Node.js](https://nodejs.org/)
- [Ollama](https://ollama.com/download) installed and running locally
- Notion integration + database (follow [Notion SDK setup](https://youtu.be/M1gu9MDucMA))
- WhatsApp account [ The qr will be displayed in the terminal when you run the project ]

### 2. Clone the Repository
```bash
git clone https://github.com/avinash7r/WhatsApp-Notion-sync.git
cd interntrack-backend
```
### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file based on `.env.example`:

Then fill in:
- `NOTION_API_KEY` – Get your integration key
- `NOTION_DB_ID` – Your Notion database ID
- `OLLAMA_URL` –  http://localhost:11434/api/chat
- Any other relevant vars

### 5. Start Ollama & Load the Model
Ensure Ollama is installed and running:
```bash
ollama pull mistral
ollama run mistral
```

### 6. Start the Server
```bash
npm run dev
```
## License

This project is licensed under the MIT License.
