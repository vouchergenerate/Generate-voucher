// Login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok) {
            window.location.href = '/admin.html'; // Redirect to admin page
        } else {
            document.getElementById('message').innerText = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
        const response = await fetch('/logout', { method: 'POST' });
        if (response.ok) {
            window.location.href = '/login.html'; // Redirect to login page
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
// Prevent simple inspection of Developer Tools
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'C' || event.key === 'J' || event.key === 'U'))) {
        event.preventDefault();
        alert('Inspect Element is disabled!');
    }
});
