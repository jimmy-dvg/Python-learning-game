// Copilot: Logic for the admin page
import { renderHeader } from '../components/header.js';
import { 
    adminGetChallenges, 
    adminGetUsers, 
    adminUpsertChallenge, 
    adminDeleteChallenge,
    adminUpdateUserRole 
} from '../services/adminService.js';
import { supabase } from '../services/supabaseClient.js';

let challengesData = [];
let usersData = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial Authorization Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }

    // 2. Load UI Components
    await renderHeader();
    await refreshData();
    setupEventListeners();
});

async function refreshData() {
    challengesData = await adminGetChallenges();
    usersData = await adminGetUsers();
    
    renderChallengesTable();
    renderUsersTable();
}

function renderChallengesTable() {
    const list = document.getElementById('challenges-list');
    if (!list) return;

    list.innerHTML = challengesData.length ? challengesData.map(c => `
        <tr>
            <td><code>${c.id}</code></td>
            <td>${c.level_id}</td>
            <td><small>${c.prompt.substring(0, 50)}...</small></td>
            <td><span class="badge bg-secondary">${c.type}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-outline-primary btn-edit-challenge" data-id="${c.id}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger btn-delete-challenge" data-id="${c.id}">Delete</button>
                </div>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="5" class="text-center">No challenges found.</td></tr>';

    // Bind Edit/Delete buttons
    document.querySelectorAll('.btn-edit-challenge').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });

    document.querySelectorAll('.btn-delete-challenge').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteChallenge(btn.dataset.id));
    });
}

function renderUsersTable() {
    const list = document.getElementById('users-list');
    if (!list) return;

    list.innerHTML = usersData.length ? usersData.map(u => `
        <tr>
            <td><strong>${u.display_name}</strong></td>
            <td><small class="text-muted">${u.id.substring(0, 8)}...</small></td>
            <td>${u.xp}</td>
            <td><span class="badge ${u.role === 'admin' ? 'bg-danger' : 'bg-info'} role-badge">${u.role}</span></td>
            <td>
                ${u.role === 'admin' 
                    ? `<button class="btn btn-sm btn-outline-secondary btn-role-update" data-id="${u.id}" data-role="player">Remove Admin</button>`
                    : `<button class="btn btn-sm btn-outline-danger btn-role-update" data-id="${u.id}" data-role="admin">Make Admin</button>`
                }
            </td>
        </tr>
    `).join('') : '<tr><td colspan="5" class="text-center">No users found.</td></tr>';

    document.querySelectorAll('.btn-role-update').forEach(btn => {
        btn.addEventListener('click', () => handleRoleUpdate(btn.dataset.id, btn.dataset.role));
    });
}

function setupEventListeners() {
    const challengeForm = document.getElementById('challenge-form');
    challengeForm.addEventListener('submit', handleUpsertChallenge);

    const btnAddCard = document.getElementById('btn-add-card');
    btnAddCard.addEventListener('click', () => {
        challengeForm.reset();
        document.getElementById('challenge-is-new').value = 'true';
        document.getElementById('form-challenge-id').disabled = false;
        document.getElementById('challengeModalLabel').textContent = 'Add New Challenge';
    });
}

function openEditModal(id) {
    const challenge = challengesData.find(c => c.id === id);
    if (!challenge) return;

    document.getElementById('form-challenge-id').value = challenge.id;
    document.getElementById('form-challenge-id').disabled = true; // Cannot change ID on edit
    document.getElementById('form-level-id').value = challenge.level_id;
    document.getElementById('form-type').value = challenge.type;
    document.getElementById('form-prompt').value = challenge.prompt;
    document.getElementById('form-starter-code').value = challenge.starter_code || '';
    document.getElementById('challenge-is-new').value = 'false';
    document.getElementById('challengeModalLabel').textContent = 'Edit Challenge';

    const modal = new bootstrap.Modal(document.getElementById('challengeModal'));
    modal.show();
}

async function handleUpsertChallenge(e) {
    e.preventDefault();
    const challenge = {
        id: document.getElementById('form-challenge-id').value,
        level_id: document.getElementById('form-level-id').value,
        type: document.getElementById('form-type').value,
        prompt: document.getElementById('form-prompt').value,
        starter_code: document.getElementById('form-starter-code').value
    };

    try {
        await adminUpsertChallenge(challenge);
        bootstrap.Modal.getInstance(document.getElementById('challengeModal')).hide();
        await refreshData();
    } catch (err) {
        alert('Operation failed: ' + err.message);
    }
}

async function handleDeleteChallenge(id) {
    if (!confirm(`Are you sure you want to delete challenge ${id}?`)) return;

    try {
        await adminDeleteChallenge(id);
        await refreshData();
    } catch (err) {
        alert('Delete failed: ' + err.message);
    }
}

async function handleRoleUpdate(userId, newRole) {
    if (!confirm(`Change user role to ${newRole}?`)) return;

    try {
        await adminUpdateUserRole(userId, newRole);
        await refreshData();
    } catch (err) {
        alert('Role update failed: ' + err.message);
    }
}
