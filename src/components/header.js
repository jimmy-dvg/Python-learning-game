export function renderHeader() {
    const headerHtml = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom" role="navigation">
        <div class="container-fluid">
            <button class="btn btn-outline-light me-2 d-md-none" id="sidebar-toggle" aria-label="Toggle Sidebar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand fw-bold" href="index.html">🐍 py-quest</a>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <span class="nav-link text-white-50">XP: <span id="user-xp-display">0</span></span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="profile.html" aria-label="View Profile">Profile</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;
    
    document.getElementById('header-container').innerHTML = headerHtml;
    highlightActiveLink();
    setupSidebarToggle();
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function setupSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }
}
