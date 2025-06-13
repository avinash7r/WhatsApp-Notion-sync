import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Notion client with API key from environment variables
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Helper to ensure all values are strings for Notion rich_text
function toText(val) {
  if (!val) return "Not Provided";
  if (Array.isArray(val)) return val.join('\n');
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

// Main function to add a new page to the Notion database
const addToNotionDB = async (data) => {
  try {
    // Create a new page in the specified Notion database with provided data
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DB_ID }, // Specify database
      properties: {
        Company: {
          title: [{ text: { content: toText(data.company) } }], // Set Company name as title
        },
        "Event Type": {
          rich_text: [{ text: { content: toText(data.event_type) } }], // Set Event Type
        },
        Date: {
          rich_text: [{ text: { content: toText(data.date) } }], // Set Date
        },
        Time: {
          rich_text: [{ text: { content: toText(data.time) } }], // Set Time
        },
        Link: {
          rich_text: [{ text: { content: toText(data.link) } }], // Set Link
        },
        Action: {
          rich_text: [{ text: { content: toText(data.action) } }], // Set Action
        },
      },
    });

    // Return success response if page creation is successful
    return { success: true, response };
  } catch (err) {
    // Log and return error if something goes wrong
    console.error('Error writing to Notion:', err.message);
    return { success: false, error: err.message };
  }
};

export default addToNotionDB;