let eventSource = null;

function submitUsername() {
    const username = document.getElementById('username').value;
    if (username) {
        // Send the username to the server
        fetch('/set_username', {
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
        });
    } else {
        alert('Please enter a username');
    }
}

function playAudio() {
    fetch('/play_audio')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function stopAudio() {
    fetch('/stop_audio')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function startEventSource() {
    if (eventSource) {
        eventSource.close();
    }

    eventSource = new EventSource('/events');
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
