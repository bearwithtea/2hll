import mailchimp from '@mailchimp/mailchimp_marketing';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName, orderSource } = req.body;

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER
  });

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        SOURCE: orderSource
      }
    });

    res.status(200).json({ message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Error subscribing user' });
  }
}
