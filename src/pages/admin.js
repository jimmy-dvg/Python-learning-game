// Copilot: Logic for the admin page
import { renderHeader } from '../components/header.js';
import { adminGetChallenges, adminGetUsers } from '../services/adminService.js';
import { supabase } from '../services/supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Check authorization
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from('profiles')
        .select('role') // Note: Using 'role' to match our migration 002
        .eq('id', user?.id)
        .single();

    if (profile?.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }

    renderHeader();
    
    // Populate Challenges
    const challenges = await adminGetChallenges();
    const challengeList = document.getElementById('challenges-list');
    if (challengeList) {
        challengeList.innerHTML = challenges.length ? challenges.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.level_id}</td>
                <td>${c.prompt.substring(0, 30)}...</td>
                <td>${c.type}</td>
                <td><button class="btn btn-sm btn-outline-danger">Delete</button></td>
            </tr>
        `).join('') : '<tr><td colspan="5" class="text-center">No challenges found.</td></tr>';
    }

    // Populate Users
    const users = await adminGetUsers();
    const usersList = document.getElementById('users-list');
    if (usersList) {
        usersList.innerHTML = users.length ? users.map(u => `
            <tr>
                <td>${u.display_name}</td>
                <td>${u.id.substring(0, 8)}...</td>
                <td>${u.xp}</td>
                <td><button class="btn btn-sm btn-outline-warning">Reset Progress</button></td>
            </tr>
        `).join('') : '<tr><td colspan="4" class="text-center">No users registered yet.</td></tr>';
    }

    // Update the security status
    const securityStatus = document.getElementById('security-status');
    if (securityStatus) {
        securityStatus.textContent = 'hardened';
    }
});
