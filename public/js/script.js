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
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');

    if (isAuthenticated && user) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        userAvatar.src = `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`;
        userName.textContent = user.username;
    } else {
        loginBtn.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

// Load brainrots
async function loadBrainrots(filter = 'all') {
    const container = document.getElementById('items-grid');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Cargando...</div>';

    try {
        const response = await fetch('/api/brainrots');
        if (response.ok) {
            let brainrots = await response.json();
            
            // Apply filter
            if (filter === 'free') {
                brainrots = brainrots.filter(b => b.description && b.description.toLowerCase().includes('free'));
            } else if (filter === 'new') {
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                brainrots = brainrots.filter(b => new Date(b.createdAt) > oneDayAgo);
            }
            
            displayBrainrots(brainrots);
        } else {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Error</h3><p>Error al cargar brainrots</p></div>';
        }
    } catch (error) {
        console.error('Error loading brainrots:', error);
        container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Error</h3><p>Error al cargar brainrots</p></div>';
    }
}

// Display brainrots
function displayBrainrots(brainrots) {
    const container = document.getElementById('items-grid');

    if (brainrots.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-box-open"></i>
                <h3>No hay brainrots</h3>
                <p>¡Sé el primero en subir uno!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = brainrots.map(brainrot => `
        <div class="item-card" data-id="${brainrot._id}">
            <img src="${brainrot.imageUrl}" alt="Brainrot" class="item-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="item-content">
                <div class="item-user">
                    <img src="https://cdn.discordapp.com/avatars/${brainrot.userId}/${brainrot.avatar}.png" alt="${brainrot.username}" class="item-avatar" onerror="this.src='https://via.placeholder.com/48?text=${brainrot.username.charAt(0)}'">
                    <span class="item-username">${brainrot.username}</span>
                    <span class="item-trade-count">(0)</span>
                </div>
                <p class="item-description">${brainrot.description || 'Sin descripción'}</p>
                <div class="item-date">${formatDate(brainrot.createdAt)}</div>
            </div>
        </div>
    `).join('');

    // Add click handlers to cards
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', () => {
            const brainrotId = card.dataset.id;
            openItemModal(brainrotId);
        });
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `hace ${minutes}m`;
    if (hours < 24) return `hace ${hours}h`;
    if (days < 7) return `hace ${days}d`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// Open item modal
async function openItemModal(brainrotId) {
    try {
        const response = await fetch('/api/brainrots');
        if (response.ok) {
            const brainrots = await response.json();
            const brainrot = brainrots.find(b => b._id === brainrotId);
            
            if (brainrot) {
                const modal = document.getElementById('item-modal');
                const modalImage = document.getElementById('modal-image');
                const modalAvatar = document.getElementById('modal-avatar');
                const modalUsername = document.getElementById('modal-username');
                const modalRobloxId = document.getElementById('modal-roblox-id');
                const modalDescription = document.getElementById('modal-description');
                
                modalImage.src = brainrot.imageUrl;
                modalAvatar.src = `https://cdn.discordapp.com/avatars/${brainrot.userId}/${brainrot.avatar}.png`;
                modalUsername.textContent = brainrot.username;
                modalRobloxId.textContent = `Roblox ID: ${brainrot.robloxId}`;
                modalDescription.textContent = brainrot.description || 'Sin descripción';
                
                modal.classList.add('active');
            }
        }
    } catch (error) {
        console.error('Error opening item modal:', error);
    }
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
            closeModal('upload-modal');
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

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Filter tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const filter = tab.dataset.filter;
        loadBrainrots(filter);
    });
});

// Bottom navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        const page = item.dataset.page;
        
        if (page === 'feed') {
            loadBrainrots();
        } else if (page === 'chats') {
            alert('Función de chats próximamente disponible');
        } else if (page === 'profile') {
            const user = checkAuth();
            if (user) {
                alert('Perfil de usuario próximamente disponible');
            } else {
                window.location.href = '/auth/discord';
            }
        }
    });
});

// Upload button
document.getElementById('upload-btn').addEventListener('click', () => {
    const user = checkAuth();
    if (user) {
        document.getElementById('upload-modal').classList.add('active');
    } else {
        window.location.href = '/auth/discord';
    }
});

// Login button
document.getElementById('login-btn').addEventListener('click', () => {
    window.location.href = '/auth/discord';
});

// Close modal buttons
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        modal.classList.remove('active');
    });
});

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Form submit
const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
    uploadForm.addEventListener('submit', handleBrainrotSubmit);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadBrainrots();
});