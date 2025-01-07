//import env variables
import 'dotenv/config';
import express from 'express';
import pkg from '@mailchimp/mailchimp_marketing';
import path from 'path';
import { fileURLToPath } from 'url';

const {
	setConfig,
	lists
} = pkg;
const app = express();

app.use(express.json());
app.use(express.static('public'));

setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: 'us4'
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  console.log('Config:', {
    apiKey: process.env.MAILCHIMP_API_KEY?.slice(-4), // Only log last 4 chars
    server: process.env.MAILCHIMP_SERVER,
    listId: process.env.MAILCHIMP_LIST_ID
  });

  try {
    const response = await lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed'
    });
    console.log('Mailchimp Response:', response);
    res.status(200).json({ message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Full Error:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: 'Error subscribing user' });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Visit http://localhost:${PORT} to view the application`);
});
