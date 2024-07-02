document.addEventListener('DOMContentLoaded', () => {
    // Initialize user list and status on page load
    if (!localStorage.getItem('userList')) {
        localStorage.setItem('userList', JSON.stringify([]));
    }
    if (!localStorage.getItem('userStatus')) {
        localStorage.setItem('userStatus', JSON.stringify({}));
    }

    // Restore the session state if available
    const username = sessionStorage.getItem('username');
    if (username) {
        showPanelBasedOnUser(username);
    }

    // Listen for storage changes to sync across tabs
    window.addEventListener('storage', (event) => {
        if (event.key === 'updateTrigger') {
            updateUserList();
        }
    });

    // Clean up invalid entries
    cleanUpUserList();
});

window.addEventListener('beforeunload', () => {
    // Clear session storage on tab close
    const username = sessionStorage.getItem('username');
    if (username) {
        removeUser(username);
        sessionStorage.removeItem('username');
    }
});

function cleanUpUserList() {
    let userList = JSON.parse(localStorage.getItem('userList')) || [];
    let userStatus = JSON.parse(localStorage.getItem('userStatus')) || {};

    // Filter out any invalid or empty usernames
    userList = userList.filter(user => user && user.trim().length > 0);
    for (let user in userStatus) {
        if (!userList.includes(user)) {
            delete userStatus[user];
        }
    }

    localStorage.setItem('userList', JSON.stringify(userList));
    localStorage.setItem('userStatus', JSON.stringify(userStatus));
    updateUserList();
}

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

    // Ensure only one user is logged in per tab
    const currentSessionUser = sessionStorage.getItem('username');
    if (currentSessionUser && currentSessionUser !== usernameInput) {
        errorMessage.textContent = `You are already logged in as ${currentSessionUser}. Please log out first.`;
        errorMessage.style.color = 'red';
        return;
    }

    if (usernameInput === 'abruti') {
        if (passwordInput === 'martinloan479') {
            sessionStorage.setItem('username', 'abruti');
            localStorage.setItem('username', 'abruti');
            errorMessage.textContent = 'Successfully logged in!';
            errorMessage.style.color = 'green';
            showAdminPanel();
        } else {
            errorMessage.textContent = 'Invalid password for abruti.';
            errorMessage.style.color = 'red';
        }
    } else {
        sessionStorage.setItem('username', usernameInput);
        localStorage.setItem('username', usernameInput);
        errorMessage.textContent = 'Successfully logged in!';
        errorMessage.style.color = 'green';
        showUserPanel(usernameInput);
        addUserToList(usernameInput); // Ensure the user is added to the list immediately
    }
}

function showAdminPanel() {
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    updateUserList();
    setInterval(checkForUpdates, 2000); // Check for updates every 2 seconds

    const disconnectButton = document.getElementById('adminDisconnectButton');
    disconnectButton.addEventListener('click', () => {
        const username = sessionStorage.getItem('username');
        if (username) {
            removeUser(username);
            sessionStorage.removeItem('username');
            localStorage.removeItem('username');
            location.reload();
        }
    });
}

function showUserPanel(username) {
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('userPanel').style.display = 'block';

    const notifyButton = document.getElementById('notifyButton');
    notifyButton.addEventListener('click', () => {
        buzzUser(username);
    });

    const disconnectButton = document.getElementById('userDisconnectButton');
    disconnectButton.addEventListener('click', () => {
        const username = sessionStorage.getItem('username');
        if (username) {
            removeUser(username);
            sessionStorage.removeItem('username');
            localStorage.removeItem('username');
            location.reload();
        }
    });
}

function addUserToList(username) {
    let userList = JSON.parse(localStorage.getItem('userList')) || [];
    let userStatus = JSON.parse(localStorage.getItem('userStatus')) || {};

    if (!userList.includes(username)) {
        userList.push(username);
        userStatus[username] = false; // User has not buzzed yet
    }

    localStorage.setItem('userList', JSON.stringify(userList));
    localStorage.setItem('userStatus', JSON.stringify(userStatus));
    updateUserList();
    // Trigger storage event across tabs
    localStorage.setItem('updateTrigger', Date.now());
}

function buzzUser(username) {
    let userStatus = JSON.parse(localStorage.getItem('userStatus')) || {};

    userStatus[username] = true; // User buzzed

    localStorage.setItem('userStatus', JSON.stringify(userStatus));
    updateUserList();
    // Trigger storage event across tabs
    localStorage.setItem('updateTrigger', Date.now());
}

function updateUserList() {
    const userList = JSON.parse(localStorage.getItem('userList')) || [];
    const userStatus = JSON.parse(localStorage.getItem('userStatus')) || {};
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

function removeUser(username) {
    let userList = JSON.parse(localStorage.getItem('userList')) || [];
    let userStatus = JSON.parse(localStorage.getItem('userStatus')) || {};

    userList = userList.filter(user => user !== username);
    delete userStatus[username];

    localStorage.setItem('userList', JSON.stringify(userList));
    localStorage.setItem('userStatus', JSON.stringify(userStatus));
    // Trigger storage event across tabs
    localStorage.setItem('updateTrigger', Date.now());
}
