document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('subscriptionForm');
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const firstName = document.querySelector('input[type="text"]').value;
        const orderSource = document.querySelector('select').value;

        submitButton.disabled = true;
        submitButton.classList.add('loading');
        buttonText.textContent = 'Sending...';

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    orderSource
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            successAlert.style.display = 'block';
            form.reset();
            buttonText.textContent = 'Sent!';

        } catch (error) {
            console.error('Error:', error);
            errorAlert.style.display = 'block';
            submitButton.disabled = false;
            buttonText.textContent = 'Get Your Guide';
        }

        submitButton.classList.remove('loading');
    });
});
