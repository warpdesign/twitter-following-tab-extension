/**
 * Popup script for X Following Tab Auto-Select extension
 */

document.addEventListener('DOMContentLoaded', function() {
    const statusElement = document.getElementById('status');
    const statusText = document.getElementById('status-text');

    // Check if DOM elements exist
    if (!statusElement || !statusText) {
        console.error('X Following Tab: Required popup elements not found');
        return;
    }

    // Check if we're currently on X.com
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs || tabs.length === 0) {
            statusElement.className = 'status inactive';
            statusText.textContent = '⚠ Unable to detect current tab';
            return;
        }

        const currentTab = tabs[0];
        const url = currentTab.url;

        if (url && (url.includes('x.com') || url.includes('twitter.com'))) {
            try {
                const parsedUrl = new URL(url);
                const path = parsedUrl.pathname;

                if (path === '/' || path === '/home') {
                    statusElement.className = 'status active';
                    statusText.textContent = '✓ Extension is active on this page';
                } else {
                    statusElement.className = 'status inactive';
                    statusText.textContent = '⚠ Extension only works on X.com home page';
                }
            } catch (error) {
                console.error('X Following Tab: Error parsing URL:', error);
                statusElement.className = 'status inactive';
                statusText.textContent = '⚠ Error checking current page';
            }
        } else {
            statusElement.className = 'status inactive';
            statusText.textContent = '⚠ Extension only works on X.com';
        }
    });
});