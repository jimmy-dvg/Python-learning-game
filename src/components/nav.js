export function renderNav() {
    const nav = document.createElement('nav');
    nav.innerHTML = `
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="level.html">Play</a></li>
            <li><a href="profile.html">Profile</a></li>
            <li><a href="login.html">Login</a></li>
        </ul>
    `;
    const container = document.getElementById('nav-container');
    if (container) {
        container.appendChild(nav);
    }
}

export function renderFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <p>&copy; 2026 py-quest. All rights reserved.</p>
    `;
    const container = document.getElementById('footer-container');
    if (container) {
        container.appendChild(footer);
    }
}
