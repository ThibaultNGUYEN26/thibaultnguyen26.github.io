const NGROK_URL = 'https://43ae-62-129-8-171.ngrok-free.app'; // Update this URL each time you restart ngrok

let eventSource = null;

async function submitUsername() {
    const username = document.getElementById('username').value;
    if (username) {
        try {
            const response = await fetch(`${NGROK_URL}/set_username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.text();
            const mainResponse = await fetch('main.html');
            const html = await mainResponse.text();
            document.open();
            document.write(html);
            document.close();
            startEventSource();
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert('Please enter a username');
    }
}

async function playAudio() {
    try {
        const response = await fetch(`${NGROK_URL}/play_audio`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function stopAudio() {
    try {
        const response = await fetch(`${NGROK_URL}/stop_audio`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function startEventSource() {
    if (eventSource) {
        eventSource.close();
    }

    eventSource = new EventSource(`${NGROK_URL}/events`);
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

document.addEventListener('DOMContentLoaded', init);
