const express = require('express');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const app = express();

app.use(express.json());
app.use(express.static('.'));

mailchimp.setConfig({
    apiKey: '5c3d0c114bdd661ae9bb09b61b1c3354',
    server: 'us4'
});

app.post('/api/subscribe', async (req, res) => {
    console.log('Received subscription request:', req.body);
    const { email } = req.body;

    try {
        console.log('Attempting to subscribe:', email);
        const response = await mailchimp.lists.addListMember('d20dfbe49d', {
            email_address: email,
            status: 'subscribed'
        });
        console.log('Subscription successful:', response);
        res.status(200).json({ message: 'Successfully subscribed' });
    } catch (error) {
        console.error('Detailed subscription error:', error);

        // Check if the error is because the member already exists
        if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
            // Send a success response since the user is already subscribed
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

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
});
