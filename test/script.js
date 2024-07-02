document.addEventListener('DOMContentLoaded', () => {
    // Restore the session state if available
    const username = sessionStorage.getItem('username');
    if (username) {
        showPanelBasedOnUser(username);
    }
});

window.addEventListener('beforeunload', () => {
    // Clear session storage on tab close
    sessionStorage.clear();
});

function checkUsername() {
    const usernameInput = document.getElementById('usernameInput').value;
    const passwordContainer = document.getElementById('passwordContainer');

    if (usernameInput === 'abruti') {
        if (!document.getElementById('passwordInput')) {
            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
            passwordInput.id = 'passwordInput';
            passwordInput.placeholder = 'Password';

            const lockIcon = document.createElement('i');
            lockIcon.className = 'bx bxs-lock-alt';
            lockIcon.style.position = 'absolute';
            lockIcon.style.right = '10%';
            lockIcon.style.top = '45%';
            lockIcon.style.transform = 'translateY(-50%)';
            lockIcon.style.fontSize = '1.5em';
            lockIcon.style.color = 'white';

            passwordContainer.appendChild(passwordInput);
            passwordContainer.appendChild(lockIcon);
            passwordContainer.classList.add('input-container');
        }
    } else {
        const passwordInput = document.getElementById('passwordInput');
        const lockIcon = passwordContainer.querySelector('i.bx.bxs-lock-alt');
        if (passwordInput) {
            passwordContainer.removeChild(passwordInput);
            passwordContainer.classList.remove('input-container');
        }
        if (lockIcon) {
            passwordContainer.removeChild(lockIcon);
        }
    }
}

function submitUsername() {
    const usernameInput = document.getElementById('usernameInput').value;
    const passwordInput = document.getElementById('passwordInput') ? document.getElementById('passwordInput').value : '';
    const errorMessage = document.getElementById('error-message');

    if (usernameInput === 'abruti') {
        if (passwordInput === 'martinloan479') {
            sessionStorage.setItem('username', 'abruti');
            errorMessage.textContent = 'Successfully logged in!';
            errorMessage.style.color = 'green';
            showAdminPanel();
        } else {
            errorMessage.textContent = 'Invalid password for abruti.';
            errorMessage.style.color = 'red';
        }
    } else {
        sessionStorage.setItem('username', usernameInput);
        errorMessage.textContent = 'Successfully logged in!';
        errorMessage.style.color = 'green';
        showUserPanel(usernameInput);
        notifyAdmin(usernameInput); // Ensure the user is added to the list immediately
    }
}

function showAdminPanel() {
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    updateUserList();
    setInterval(checkForUpdates, 2000); // Check for updates every 2 seconds
}

function showUserPanel(username) {
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('userPanel').style.display = 'block';
    notifyAdmin(username); // Ensure the user is added to the list immediately
}

function notifyAdmin(username) {
    let userList = JSON.parse(sessionStorage.getItem('userList')) || [];
    let userStatus = JSON.parse(sessionStorage.getItem('userStatus')) || {};

    if (!userList.includes(username)) {
        userList.push(username);
        userStatus[username] = false; // Default status is false (not notified)
    }

    if (username !== 'abruti') {
        userStatus[username] = true; // Mark the user as notified
    }

    sessionStorage.setItem('userList', JSON.stringify(userList));
    sessionStorage.setItem('userStatus', JSON.stringify(userStatus));
    updateUserList();
}

function updateUserList() {
    const userList = JSON.parse(sessionStorage.getItem('userList')) || [];
    const userStatus = JSON.parse(sessionStorage.getItem('userStatus')) || {};
    const userListElement = document.getElementById('userList');
    userListElement.innerHTML = '';

    userList.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        const dot = document.createElement('span');
        dot.className = 'status-dot';
        dot.style.backgroundColor = userStatus[user] ? 'green' : 'gray';
        li.appendChild(dot);
        userListElement.appendChild(li);
    });
    console.log('Updated User List:', userList); // Debugging: Print the user list to the console
}

function checkForUpdates() {
    updateUserList(); // Simply update the user list every interval
}

function showPanelBasedOnUser(username) {
    if (username === 'abruti') {
        showAdminPanel();
    } else {
        showUserPanel(username);
    }
}
