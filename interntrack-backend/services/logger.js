import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_PATH = path.join(LOG_DIR, 'whatsapp_message_log.json');

export function logMessage(entry) {
  let logs = [];
  try {
    // Ensure the logs directory exists
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    if (fs.existsSync(LOG_PATH)) {
      logs = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
    }
  } catch (e) {
    logs = [];
  }
  logs.push(entry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));
}