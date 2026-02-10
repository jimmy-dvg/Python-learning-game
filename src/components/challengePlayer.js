/**
 * Challenge Player Component
 * Handles the rendering and interaction for individual coding challenges.
 */

import { requestHint } from '../services/hintService.js';
import { runSubmission } from '../services/runnerClient.js';

/**
 * Renders a challenge into the provided container.
 * 
 * @param {HTMLElement} containerEl - The element to render into.
 * @param {Object} challenge - The challenge object to play.
 * @param {Object} userContext - Current user state (id, xp, etc.)
 */
export function renderChallenge(containerEl, challenge, userContext) {
    containerEl.innerHTML = `
        <div class="challenge-card card shadow-sm mb-4">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0">${challenge.title || 'Coding Challenge'}</h5>
                <span class="badge bg-light text-primary">Reward: ${challenge.xp} XP</span>
            </div>
            <div class="card-body">
                <p class="challenge-prompt lead mb-4">${challenge.prompt}</p>
                
                <div class="editor-container mb-3">
                    <label for="code-editor" class="form-label fw-bold">Python Code:</label>
                    <textarea id="code-editor" class="form-control code-font" rows="8" spellcheck="false">${challenge.starterCode || ''}</textarea>
                </div>

                <div class="action-buttons d-flex gap-2 mb-3">
                    <button id="btn-run" class="btn btn-success flex-grow-1">
                        <i class="bi bi-play-fill"></i> Run Code
                    </button>
                    <button id="btn-hint" class="btn btn-outline-warning">
                        💡 Get Hint
                    </button>
                </div>

                <div id="results-area" class="mt-3 d-none">
                    <h6 class="fw-bold">Results:</h6>
                    <div id="test-outputs" class="list-group list-group-flush"></div>
                </div>

                <div id="hint-area" class="mt-3"></div>
            </div>
        </div>
    `;

    setupEventListeners(containerEl, challenge, userContext);
}

function setupEventListeners(container, challenge, userContext) {
    const runBtn = container.querySelector('#btn-run');
    const hintBtn = container.querySelector('#btn-hint');
    const editor = container.querySelector('#code-editor');
    const resultsArea = container.querySelector('#results-area');
    const testOutputs = container.querySelector('#test-outputs');
    const hintArea = container.querySelector('#hint-area');

    runBtn.addEventListener('click', async () => {
        const code = editor.value;
        runBtn.disabled = true;
        runBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Executing...';

        try {
            const result = await runSubmission({ 
                userId: userContext.id, 
                challengeId: challenge.id, 
                code 
            });
            displayResults(result, resultsArea, testOutputs, userContext);
        } catch (err) {
            console.error(err);
            alert(`Execution failed: ${err.message}`);
        } finally {
            runBtn.disabled = false;
            runBtn.innerHTML = 'Run Code';
        }
    });

    hintBtn.addEventListener('click', () => {
        const response = requestHint(userContext.id, challenge.id);
        if (response.error) {
            alert(response.error);
        } else {
            const hintDiv = document.createElement('div');
            hintDiv.className = 'alert alert-info mt-2 alert-dismissible fade show';
            hintDiv.innerHTML = `
                <strong>Hint #${response.hintIndex + 1}:</strong> ${response.hint}
                <small class="d-block text-muted">Cost: ${response.cost} XP</small>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            hintArea.appendChild(hintDiv);
            
            // Update XP display in header if exists
            const xpDisplay = document.getElementById('user-xp-display');
            if (xpDisplay) xpDisplay.innerText = response.remainingXp;
        }
    });
}

function displayResults(result, container, outputList, userContext) {
    container.classList.remove('d-none');
    outputList.innerHTML = '';

    result.tests.forEach(test => {
        const item = document.createElement('div');
        item.className = `list-group-item d-flex justify-content-between align-items-center ${test.passed ? 'text-success' : 'text-danger'}`;
        item.innerHTML = `
            <span>${test.name}</span>
            <span class="badge ${test.passed ? 'bg-success' : 'bg-danger'} rounded-pill">
                ${test.passed ? 'Passed' : 'Failed'}
            </span>
        `;
        outputList.appendChild(item);
    });

    if (result.success) {
        triggerXpAnimation(result.xp);
        // TODO: Update persistent user XP in Supabase
    }
}

function triggerXpAnimation(xp) {
    const xpDisplay = document.getElementById('user-xp-display');
    if (!xpDisplay) return;

    xpDisplay.classList.add('text-success', 'fw-bold');
    xpDisplay.style.transition = 'all 0.5s';
    xpDisplay.style.transform = 'scale(1.5)';
    
    setTimeout(() => {
        const currentXP = parseInt(xpDisplay.innerText);
        xpDisplay.innerText = currentXP + xp;
        xpDisplay.style.transform = 'scale(1)';
        setTimeout(() => xpDisplay.classList.remove('text-success', 'fw-bold'), 500);
    }, 500);
}
