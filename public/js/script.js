// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            updateAuthUI(true, user);
            return user;
        } else {
            updateAuthUI(false);
            return null;
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        updateAuthUI(false);
        return null;
    }
}

// Update UI based on authentication status
function updateAuthUI(isAuthenticated, user = null) {
    const authButtons = document.getElementById('auth-buttons');
    const uploadSection = document.getElementById('upload-section');

    if (isAuthenticated && user) {
        authButtons.innerHTML = `
            <div class="user-info">
                <img src="https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png" alt="${user.username}" class="user-avatar">
                <span class="user-name">${user.username}</span>
            </div>
            <a href="/logout" class="btn btn-outline">Cerrar Sesión</a>
        `;
        uploadSection.style.display = 'block';
    } else {
        authButtons.innerHTML = `
            <a href="/auth/discord" class="btn btn-primary">
                <span class="btn-icon">🎮</span>
                Login con Discord
            </a>
        `;
        uploadSection.style.display = 'none';
    }
}

// Load brainrots
async function loadBrainrots() {
    const container = document.getElementById('brainrots-container');
    container.innerHTML = '<div class="loading">Cargando brainrots...</div>';

    try {
        const response = await fetch('/api/brainrots');
        if (response.ok) {
            const brainrots = await response.json();
            displayBrainrots(brainrots);
        } else {
            container.innerHTML = '<div class="error">Error al cargar brainrots</div>';
        }
    } catch (error) {
        console.error('Error loading brainrots:', error);
        container.innerHTML = '<div class="error">Error al cargar brainrots</div>';
    }
}

// Display brainrots
function displayBrainrots(brainrots) {
    const container = document.getElementById('brainrots-container');

    if (brainrots.length === 0) {
        container.innerHTML = '<div class="loading">No hay brainrots aún. ¡Sé el primero en subir uno!</div>';
        return;
    }

    container.innerHTML = brainrots.map(brainrot => `
        <div class="brainrot-card">
            <img src="${brainrot.imageUrl}" alt="Brainrot" class="brainrot-image">
            <div class="brainrot-content">
                <div class="brainrot-user">
                    <img src="https://cdn.discordapp.com/avatars/${brainrot.userId}/${brainrot.avatar}.png" alt="${brainrot.username}" class="brainrot-avatar">
                    <div>
                        <div class="brainrot-username">${brainrot.username}</div>
                        <div class="brainrot-roblox-id">Roblox ID: ${brainrot.robloxId}</div>
                    </div>
                </div>
                <p class="brainrot-description">${brainrot.description || 'Sin descripción'}</p>
                <div class="brainrot-date">${new Date(brainrot.createdAt).toLocaleDateString('es-ES')}</div>
            </div>
        </div>
    `).join('');
}

// Handle brainrot form submission
async function handleBrainrotSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = {
        robloxId: formData.get('robloxId'),
        imageUrl: formData.get('imageUrl'),
        description: formData.get('description')
    };

    try {
        const response = await fetch('/api/brainrots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const brainrot = await response.json();
            alert('¡Brainrot subido exitosamente!');
            form.reset();
            loadBrainrots();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error submitting brainrot:', error);
        alert('Error al subir brainrot');
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadBrainrots();

    // Add form submit handler
    const brainrotForm = document.getElementById('brainrot-form');
    if (brainrotForm) {
        brainrotForm.addEventListener('submit', handleBrainrotSubmit);
    }
});