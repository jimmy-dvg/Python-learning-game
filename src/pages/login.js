// Copilot: Logic for the login page
import { login, register } from '../services/authService.js';
import { demoLogin, syncLocalProgressToServer } from '../services/authService.demo.js';
import { renderHeader } from '../components/header.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        renderHeader();
    } catch (err) {
        console.warn('Header rendering failed:', err);
    }
    
    const form = document.getElementById('auth-form');
    const toggle = document.getElementById('auth-toggle');
    const demoBtn = document.getElementById('demoBtn');
    const toggleText = document.getElementById('auth-toggle-text');
    const title = document.getElementById('auth-title');
    const submitBtn = document.getElementById('auth-submit');
    const displayNameGroup = document.getElementById('display-name-group');

    let isLogin = true;

    if (toggle) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            isLogin = !isLogin;
            title.innerText = isLogin ? 'Welcome Back' : 'Create Account';
            submitBtn.innerText = isLogin ? 'Login' : 'Register';
            toggle.innerText = isLogin ? 'Register' : 'Login';
            toggleText.firstChild.textContent = isLogin ? "Don't have an account? " : "Already have an account? ";
            displayNameGroup.style.display = isLogin ? 'none' : 'block';
            document.getElementById('display-name').required = !isLogin;
        });
    }

    if (demoBtn) {
        demoBtn.addEventListener('click', async () => {
            const errorDiv = document.getElementById('auth-error');
            try {
                errorDiv.classList.add('d-none');
                demoBtn.disabled = true;
                demoBtn.innerText = 'Initializing Demo...';

                const user = await demoLogin();
                await syncLocalProgressToServer(user.id);
                
                window.location.href = 'dashboard.html';
            } catch (err) {
                errorDiv.innerText = 'Demo Error: ' + err.message;
                errorDiv.classList.remove('d-none');
                demoBtn.disabled = false;
                demoBtn.innerText = 'Try Demo Account';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const displayName = document.getElementById('display-name').value;
            const errorDiv = document.getElementById('auth-error');

            try {
                errorDiv.classList.add('d-none');
                submitBtn.disabled = true;
                submitBtn.innerText = 'Processing...';

                if (isLogin) {
                    await login(email, password);
                } else {
                    await register(email, password, displayName);
                }
                window.location.href = 'dashboard.html';
            } catch (err) {
                errorDiv.innerText = err.message;
                errorDiv.classList.remove('d-none');
                submitBtn.disabled = false;
                submitBtn.innerText = isLogin ? 'Login' : 'Register';
            }
        });
    }
});
