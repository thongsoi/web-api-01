const API_BASE = '/api';

// Utility functions
function showMessage(message, type = 'success') {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

function clearMessages() {
    document.getElementById('messages').innerHTML = '';
}

// API functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(API_BASE + url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return null; // No content
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Load all users
async function loadUsers() {
    try {
        document.getElementById('usersList').innerHTML = '<div class="loading">Loading users...</div>';
        const users = await apiRequest('/users');
        displayUsers(users);
    } catch (error) {
        showMessage('Failed to load users: ' + error.message, 'error');
        document.getElementById('usersList').innerHTML = '';
    }
}

// Display users in the grid
function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    
    if (!users || users.length === 0) {
        usersList.innerHTML = '<p>No users found.</p>';
        return;
    }

    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <h3>${escapeHtml(user.name)}</h3>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
            <div class="user-actions">
                <button class="btn-edit" onclick="editUser(${user.id}, '${escapeHtml(user.name)}', '${escapeHtml(user.email)}')">Edit</button>
                <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Create user
async function createUser(event) {
    event.preventDefault();
    clearMessages();
    
    const name = document.getElementById('createName').value;
    const email = document.getElementById('createEmail').value;

    try {
        const user = await apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify({ name, email })
        });
        
        showMessage(`User "${user.name}" created successfully!`);
        document.getElementById('createForm').reset();
        loadUsers();
    } catch (error) {
        showMessage('Failed to create user: ' + error.message, 'error');
    }
}

// Get single user
async function getUser(event) {
    event.preventDefault();
    clearMessages();
    
    const id = document.getElementById('userId').value;

    try {
        const user = await apiRequest(`/users/${id}`);
        document.getElementById('singleUser').innerHTML = `
            <div class="user-card" style="margin-top: 20px; max-width: 400px;">
                <h3>${escapeHtml(user.name)}</h3>
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
            </div>
        `;
    } catch (error) {
        showMessage('User not found: ' + error.message, 'error');
        document.getElementById('singleUser').innerHTML = '';
    }
}

// Update user
async function updateUser(event) {
    event.preventDefault();
    clearMessages();
    
    const id = document.getElementById('updateId').value;
    const name = document.getElementById('updateName').value;
    const email = document.getElementById('updateEmail').value;

    try {
        const user = await apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name, email })
        });
        
        showMessage(`User updated successfully!`);
        document.getElementById('updateForm').reset();
        loadUsers();
    } catch (error) {
        showMessage('Failed to update user: ' + error.message, 'error');
    }
}

// Delete user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    clearMessages();
    
    try {
        await apiRequest(`/users/${id}`, { method: 'DELETE' });
        showMessage('User deleted successfully!');
        loadUsers();
    } catch (error) {
        showMessage('Failed to delete user: ' + error.message, 'error');
    }
}

// Edit user (populate update form)
function editUser(id, name, email) {
    document.getElementById('updateId').value = id;
    document.getElementById('updateName').value = name;
    document.getElementById('updateEmail').value = email;
    document.getElementById('updateName').focus();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createForm').addEventListener('submit', createUser);
    document.getElementById('getUserForm').addEventListener('submit', getUser);
    document.getElementById('updateForm').addEventListener('submit', updateUser);
    document.getElementById('loadUsers').addEventListener('click', loadUsers);
    
    // Load users on page load
    loadUsers();
});