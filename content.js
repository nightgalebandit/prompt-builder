/**
 * AI Writing Assistant - Content Script
 * Handles text selection, popup creation, and rephrasing logic.
 */

let currentPopup = null;

/**
 * Main event listener for text selection
 */
document.addEventListener('mouseup', (event) => {
    // Small delay to ensure selection is captured correctly
    setTimeout(() => {
        handleSelection(event);
    }, 10);
});

/**
 * Handle the text selection event
 */
function handleSelection(event) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    // If no text is selected or clicking inside an existing popup, don't create a new one
    if (!selectedText || (currentPopup && currentPopup.contains(event.target))) {
        return;
    }

    // Remove existing popup if any
    removePopup();

    // Create and position the new popup
    createPopup(selectedText, selection);
}

/**
 * Create the glassmorphism popup element
 */
function createPopup(text, selection) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const popup = document.createElement('div');
    popup.className = 'ai-assistant-popup';
    
    // Calculate position (centered above selection)
    const top = rect.top + window.scrollY - 10;
    const left = rect.left + window.scrollX + (rect.width / 2);
    
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.transform = 'translate(-50%, -100%)';

    popup.innerHTML = `
        <div class="ai-assistant-header">
            <h3 class="ai-assistant-title">AI Assistant</h3>
            <button class="ai-assistant-close" id="ai-close-btn">&times;</button>
        </div>
        <div class="ai-assistant-body">
            <div class="ai-assistant-original">"${text.length > 100 ? text.substring(0, 100) + '...' : text}"</div>
            <button class="ai-assistant-rephrase-btn" id="ai-rephrase-btn">Rephrase</button>
            <div class="ai-assistant-loading" id="ai-loading">
                <div class="ai-assistant-spinner"></div>
            </div>
            <div class="ai-assistant-result" id="ai-result"></div>
        </div>
    `;

    document.body.appendChild(popup);
    currentPopup = popup;

    // Event Listeners for popup elements
    document.getElementById('ai-close-btn').onclick = (e) => {
        e.stopPropagation();
        removePopup();
    };

    document.getElementById('ai-rephrase-btn').onclick = async (e) => {
        e.stopPropagation();
        await handleRephrase(text);
    };

    // Prevent clicks inside popup from bubbling up
    popup.onmousedown = (e) => e.stopPropagation();
    popup.onmouseup = (e) => e.stopPropagation();
}

/**
 * Handle the rephrase logic
 */
async function handleRephrase(text) {
    const btn = document.getElementById('ai-rephrase-btn');
    const loading = document.getElementById('ai-loading');
    const resultArea = document.getElementById('ai-result');

    // UI State: Loading
    btn.style.display = 'none';
    loading.style.display = 'flex';
    resultArea.classList.remove('visible');

    try {
        // Simulate API call delay
        const rephrasedText = await mockApiCall(text);
        
        // UI State: Success
        loading.style.display = 'none';
        resultArea.textContent = rephrasedText;
        resultArea.classList.add('visible');
    } catch (error) {
        loading.style.display = 'none';
        btn.style.display = 'block';
        resultArea.textContent = "Error: Could not rephrase text.";
        resultArea.classList.add('visible');
    }
}

/**
 * Mock API call for rephrasing
 * This is where you would integrate OpenAI or another LLM API
 */
async function mockApiCall(text) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Dummy logic: Reverse words or simple synonym replacement
            // For this demo, let's do a "polished" version of the text
            const words = text.split(' ');
            if (words.length <= 3) {
                resolve(`Refined: ${text.split('').reverse().join('')} (Reversed for demo)`);
            } else {
                // Simple "AI-like" transformation for demo
                const polished = text
                    .replace(/\b(good)\b/gi, 'excellent')
                    .replace(/\b(bad)\b/gi, 'suboptimal')
                    .replace(/\b(happy)\b/gi, 'delighted')
                    .replace(/\b(think)\b/gi, 'contemplate');
                
                if (polished === text) {
                    resolve(`Rephrased: ${words.reverse().join(' ')}`);
                } else {
                    resolve(`AI Suggestion: ${polished}`);
                }
            }
        }, 800);
    });
}

/**
 * Remove the popup from DOM
 */
function removePopup() {
    if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
    }
}

/**
 * Close popup when clicking outside
 */
document.addEventListener('mousedown', (event) => {
    if (currentPopup && !currentPopup.contains(event.target)) {
        removePopup();
    }
});
