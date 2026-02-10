import { renderHeader } from './components/header.js';

// Initialize shared components
document.addEventListener('DOMContentLoaded', async () => {
    await renderHeader();
    
    // Page specific logic can be added here or in separate modules imported based on window.location
    console.log(`Loaded page: ${window.location.pathname}`);
});
