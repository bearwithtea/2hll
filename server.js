//import env variables
import 'dotenv/config';

import express from 'express'; //import express
import pkg from '@mailchimp/mailchimp_marketing'; //mailchimp package
const { setConfig, lists } = pkg; //mailchimp functions
const app = express(); //express app

app.use(express.json()); //parse json
app.use(express.static('.')); //serve static files

//setup mailchimp
setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY, //apikey
    server: process.env.MAILCHIMP_SERVER //where our server is located
});

//subscription endpoint
app.post('/api/subscribe', async (req, res) => {
    console.log('Received subscription request:', req.body);
    const { email } = req.body;

    try {
        console.log('Attempting to subscribe:', email);
        const response = await lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
            email_address: email,
            status: 'subscribed'
        });
        console.log('Subscription successful:', response);
        res.status(200).json({ message: 'Successfully subscribed' });
    } catch (error) {
        console.error('Detailed subscription error:', error);

        if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
            return res.status(200).json({
                message: 'You\'re already subscribed! We\'ll send you the guide again.',
                alreadySubscribed: true
            });
        }

        res.status(500).json({
            error: 'Error subscribing user',
            details: error.message
        });
    }
});

//start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
});
