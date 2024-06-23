let eventSource = null;

function submitUsername() {
    const username = document.getElementById('username').value;
    if (username) {
        // Send the username to the server
        fetch('https://b2b6-62-129-8-171.ngrok-free.app/set_username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username }),
        }).then(() => {
            // Load the main content
            fetch('main.html')
                .then(response => response.text())
                .then(html => {
                    document.open();
                    document.write(html);
                    document.close();
                    // Start listening for updates
                    startEventSource();
                });
        }).catch(error => console.error('Error:', error));
    } else {
        alert('Please enter a username');
    }
}

function playAudio() {
    fetch('https://b2b6-62-129-8-171.ngrok-free.app/play_audio')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function stopAudio() {
    fetch('https://b2b6-62-129-8-171.ngrok-free.app/stop_audio')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function startEventSource() {
    if (eventSource) {
        eventSource.close();
    }

    eventSource = new EventSource('https://b2b6-62-129-8-171.ngrok-free.app/events');
    eventSource.onmessage = function (event) {
        const usernames = JSON.parse(event.data);
        const welcomeMessages = document.getElementById('welcome-messages');
        if (welcomeMessages) {
            welcomeMessages.innerHTML = '';
            usernames.forEach(username => {
                const message = document.createElement('div');
                message.textContent = `Welcome, ${username}!`;
                welcomeMessages.appendChild(message);
            });
        }
    };
}

// When the main page loads, start the SSE connection
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('welcome-messages')) {
        startEventSource();
    }
});
