document.querySelector('.purchase-button').addEventListener('click', function()
  {
    console.log('Purchase clicked');
});

document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('subscriptionForm');
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';

        submitButton.disabled = true;
        submitButton.classList.add('loading');
        buttonText.textContent = 'Sending...';

        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            successAlert.style.display = 'block';
            form.reset();

            submitButton.classList.remove('loading');
            buttonText.textContent = 'Sent!';

        } catch (error) {
            errorAlert.style.display = 'block';
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            buttonText.textContent = 'Get Your Guide';
        }
    });
});
