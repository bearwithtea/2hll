import 'dotenv/config';
import express from 'express';
import pkg from '@mailchimp/mailchimp_marketing';
import path from 'path';
import { fileURLToPath } from 'url';

const mailchimp = pkg;
const app = express();

app.use(express.json());
app.use(express.static('.'));

mailchimp.setConfig({
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
 console.log('Received subscription request:', { email });

 try {
   // Test connection
   console.log('Testing Mailchimp connection...');
   const testResponse = await mailchimp.lists.getAllLists();
   console.log('Connection successful, total lists:', testResponse.lists.length);

   console.log('Attempting to subscribe:', email);
   const addMemberResponse = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
     email_address: email,
     status: 'subscribed'
   });
   console.log('Subscribe success:', addMemberResponse);
   res.status(200).json({ message: 'Successfully subscribed' });
 } catch (error) {
   console.error('Detailed subscription error:', error);
   if (error.response?.body?.title === 'Member Exists') {
     return res.status(200).json({ message: 'You\'re already subscribed! Guide resent.' });
   }
   res.status(400).json({ error: error.response?.body?.detail || 'Error subscribing user' });
 }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Visit http://localhost:${PORT} to view the application`);
});
