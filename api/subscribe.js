// /api/subscribe.js
import pkg from '@mailchimp/mailchimp_marketing';
const { setConfig, lists } = pkg;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName, orderSource } = req.body; // Add missing fields
  console.log('Request body:', req.body);

  try {
    setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER
    });

    const addMemberResponse = await lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        SOURCE: orderSource
      }
    });
    console.log('Mailchimp response:', addMemberResponse);
    res.status(200).json({ message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Mailchimp error:', error);
    res.status(500).json({ error: error.message });
  }
}
