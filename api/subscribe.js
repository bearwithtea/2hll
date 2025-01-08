// /api/subscribe.js
import pkg from '@mailchimp/mailchimp_marketing';
const { setConfig, lists } = pkg;

export default async function handler(req, res) {
 console.log('API route hit');
 console.log('Request method:', req.method);
 console.log('Request headers:', req.headers);

 if (req.method !== 'POST') {
   console.log('Invalid method');
   return res.status(405).json({ error: 'Method not allowed' });
 }

 console.log('Raw request body:', req.body);
 const { email, firstName, orderSource } = req.body;
 console.log('Parsed fields:', { email, firstName, orderSource });

 try {
   console.log('Attempting Mailchimp config');
   setConfig({
     apiKey: process.env.MAILCHIMP_API_KEY,
     server: process.env.MAILCHIMP_SERVER
   });

   console.log('Config set, attempting to add member');
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
   console.error('Detailed error:', {
     message: error.message,
     stack: error.stack,
     details: error
   });
   res.status(500).json({ error: error.message });
 }
}
