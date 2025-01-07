document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('subscriptionForm');
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted'); // Debug log

        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';

        submitButton.disabled = true;
        submitButton.classList.add('loading');
        buttonText.textContent = 'Sending...';

        const email = document.getElementById('email').value;
        console.log('Attempting to send email:', email); // Debug log

        try {
            const response = await fetch('http://localhost:3000/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            console.log('Response received:', response); // Debug log

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success data:', data); // Debug log

            successAlert.style.display = 'block';
            form.reset();

            submitButton.classList.remove('loading');
            buttonText.textContent = 'Sent!';

        } catch (error) {
            console.error('Error:', error); // Debug log
            errorAlert.style.display = 'block';
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            buttonText.textContent = 'Get Your Guide';
        }
    });
});
