// /api/subscribe.js
import mailchimp from '@mailchimp/mailchimp_marketing';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName, orderSource } = req.body;

  try {
    // Verify environment variables
    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_SERVER || !process.env.MAILCHIMP_LIST_ID) {
      throw new Error('Missing required environment variables');
    }

    // Log config attempt
    console.log('Setting Mailchimp config with server:', process.env.MAILCHIMP_SERVER);

    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER.trim() // Ensure no whitespace
    });

    // Test connection
    try {
      await mailchimp.ping.get();
    } catch (pingError) {
      console.error('Mailchimp connection test failed:', pingError);
      throw new Error('Failed to connect to Mailchimp');
    }

    // Attempt subscription
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID.trim(), {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        SOURCE: orderSource
      }
    });

    console.log('Subscription successful:', response.id);
    res.status(200).json({ message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
}
