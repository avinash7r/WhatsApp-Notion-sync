import pkg from 'whatsapp-web.js';
import axios from 'axios';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { logMessage } from './logger.js';

// Initialize WhatsApp client with local authentication and puppeteer options
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './wwebjs',
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Listen for QR code event and display QR in terminal for authentication
client.on('qr', qr => {
  console.log('📱 Scan this QR code in WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Listen for client ready event
client.on('ready', () => {
  console.log('✅ WhatsApp client is ready!');
});

// List of target contact/group IDs to monitor
const targetContact = [
  'T&Pgroup1@c.us',
  'T&Pgroup2@c.us',
  // Add more IDs as needed
];

// Listen for incoming messages
client.on('message', async message => {
  // Get contact name from message
  let contactName = '';
  try {
    const contact = await message.getContact();
    contactName = contact.pushname || contact.name || contact.number || '';
  } catch (e) {
    contactName = '';
  }

  // Prepare log entry for the received message
  const logEntry = {
    from: message.from,
    name: contactName,
    body: message.body,
    timestamp: new Date().toISOString()
  };

  // Log the message using the logger utility
  logMessage(logEntry);

  // If message is from a target contact, send it to AI parser
  if (targetContact.includes(message.from)) {
    console.log(`📬Received message from your target contact`);
    // Send message body to AI parsing endpoint
    const aiParsed = await axios.post('http://localhost:5000/parse', {
      message: message.body
    }).then(res => res.data.result).catch(err => {
      console.error('Error parsing message with AI:', err.message);
      return null;
    });
    if (!aiParsed) {
      console.error('Failed to parse message with AI');
      return;
    }
    // You can add further actions with aiParsed here
  }
});

// Initialize the WhatsApp client
client.initialize().catch(err => {
  console.error('Error initializing WhatsApp client:', err.message);
});