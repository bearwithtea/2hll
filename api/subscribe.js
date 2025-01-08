// /api/subscribe.js
import pkg from '@mailchimp/mailchimp_marketing';
const { setConfig, lists } = pkg;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER
    });

    const addMemberResponse = await lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed'
    });

    res.status(200).json({ message: 'Successfully subscribed' });
  } catch (error) {
    res.status(500).json({ error: 'Error subscribing user' });
  }
}
