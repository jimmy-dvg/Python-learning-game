// Copilot: Logic for the profile page
import { renderHeader } from '../components/header.js';
import { uploadAvatar } from '../services/storageService.js';
import { getCurrentUser } from '../services/authService.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderHeader();
    
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const avatarInput = document.getElementById('avatar-input');
    const avatarPreview = document.getElementById('avatar-preview');

    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // local preview
        const reader = new FileReader();
        reader.onload = (e) => avatarPreview.src = e.target.result;
        reader.readAsDataURL(file);

        try {
            avatarPreview.style.opacity = '0.5';
            const publicUrl = await uploadAvatar(user.id, file);
            avatarPreview.src = publicUrl;
            alert('Profile picture updated!');
        } catch (err) {
            alert('Upload failed: ' + err.message);
        } finally {
            avatarPreview.style.opacity = '1';
        }
    });
});
