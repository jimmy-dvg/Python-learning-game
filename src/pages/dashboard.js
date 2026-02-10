// Copilot: Logic for the dashboard page
import { renderHeader } from '../components/header.js';
import { getCurrentUser, logout } from '../services/authService.js';

document.addEventListener('DOMContentLoaded', async () => {
    await renderHeader();

    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
        userNameEl.textContent = user.user_metadata?.display_name || user.email;
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await logout();
            window.location.href = 'login.html';
        });
    }
});
