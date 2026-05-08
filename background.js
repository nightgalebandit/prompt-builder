chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type !== 'AI_ACTION') return;

    fetch('https://api.deepseek.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'API KEY HERE',
            'x-api-version': '2024-06'
        },
        body: JSON.stringify({
            model: 'TYPE MODEL NAME HERE',
            max_tokens: 1024,
            messages: [{ role: 'user', content: buildPrompt(request.action, request.text) }]
        })
    })
    .then(res => res.json())
    .then(data => sendResponse({ success: true, result: data.content[0].text }))
    .catch(err => sendResponse({ success: false, error: err.message }));

    return true; // keeps the message channel open for async response
});

function buildPrompt(action, text) {
    const prompts = {
        rephrase:  `Rephrase the following text. Return only the rephrased version, no explanation:\n\n${text}`,
        summarize: `Summarize the following text in 1-2 sentences. Return only the summary:\n\n${text}`,
        fix:       `Fix any grammar and punctuation errors in the following text. Return only the corrected version:\n\n${text}`,
        tone:      `Rewrite the following text in a professional, formal tone. Return only the rewritten version:\n\n${text}`,
        shorten:   `Make the following text more concise while preserving meaning. Return only the shortened version:\n\n${text}`,
        expand:    `Expand the following text with more detail and context. Return only the expanded version:\n\n${text}`
    };
    return prompts[action] || text;
}

function getSelectedText() {
    const selection = window.getSelection();
    return selection ? selection.toString() : '';
}   

function replaceSelectedText(newText) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(newText));
    return true;
}

// Note: The above code assumes the API response structure is { content: [{ text: 'result here' }] }. Adjust as needed based on actual API response.