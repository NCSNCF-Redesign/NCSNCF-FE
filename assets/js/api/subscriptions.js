import { pythonURI } from './config.js';

document.querySelectorAll('.ncsncf-subscribe-form')
    .forEach(form => {

        form.addEventListener('submit', async event => {
            event.preventDefault();

            const email = form.elements.email.value.trim();
            const status = form.querySelector('.subscription-status');
            const button = form.querySelector('button[type="submit"]');

            button.disabled = true;
            status.textContent = 'Submitting subscription...';

            try {
                const response = await fetch(
                    `${pythonURI}/api/subscriptions`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    }
                );

                if (!response.ok) {
                    throw new Error('Subscription request failed.');
                }

                status.textContent =
                    'Check your email to confirm your subscription.';

                form.reset();

            } catch (error) {
                status.textContent =
                    'Unable to subscribe. Please try again later.';
            } finally {
                button.disabled = false;
            }
        });
    });