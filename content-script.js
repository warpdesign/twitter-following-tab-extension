/**
 * X Following Tab Auto-Select Content Script
 * Automatically selects the "Following" tab when navigating to X.com from external sources
 * Language-agnostic implementation using structural selectors
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    maxRetries: 8,
    retryDelay: 600,
    observerTimeout: 8000
  };

  let hasTriedSelection = false;
  let observer = null;
  let retryCount = 0;

  /**
   * Utility function to wait for a specified time
   */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Find the Following tab using simple, reliable selector
   * The Following tab is the second tab in the main tablist
   */
  function findFollowingTab() {
    const tabs = document.querySelectorAll('main [role="tablist"] [role="tab"]');

    if (tabs.length >= 2) {
      return tabs[1]; // Second tab is Following
    }

    return null;
  }

  /**
   * Check if we're on the home page where tab switching should occur
   */
  function isOnHomePage() {
    const path = window.location.pathname;
    return path === '/' || path === '/home';
  }

  /**
   * Check if the Following tab is already selected
   */
  function isFollowingTabSelected() {
    const followingTab = findFollowingTab();
    if (!followingTab) return false;

    // Check various indicators that the tab is selected
    return (
      followingTab.getAttribute('aria-selected') === 'true' ||
      followingTab.classList.contains('selected') ||
      followingTab.classList.contains('active') ||
      followingTab.getAttribute('data-selected') === 'true' ||
      followingTab.closest('[aria-selected="true"]') !== null
    );
  }

  /**
   * Check if this is a fresh navigation to X.com
   * This helps avoid interfering with internal navigation
   */
  function isFreshNavigation() {
    // Check if we have referrer from external site or no referrer (address bar)
    const referrer = document.referrer;
    const currentDomain = window.location.hostname;

    if (!referrer) {
      // No referrer usually means address bar navigation or bookmark
      return true;
    }

    try {
      const referrerDomain = new URL(referrer).hostname;
      // If referrer is from a different domain, it's external navigation
      return referrerDomain !== currentDomain &&
             referrerDomain !== 'x.com' &&
             referrerDomain !== 'twitter.com';
    } catch (error) {
      // If we can't parse referrer, assume it's fresh navigation
      return true;
    }
  }

  /**
   * Attempt to click the Following tab
   */
  async function selectFollowingTab() {
    if (!isOnHomePage()) {
      console.debug('X Following Tab: Not on home page, skipping');
      return false;
    }

    if (isFollowingTabSelected()) {
      console.debug('X Following Tab: Following tab already selected');
      return true;
    }

    const followingTab = findFollowingTab();

    if (followingTab) {
      try {
        console.log('X Following Tab: Clicking Following tab');

        // Try multiple click methods to ensure compatibility
        followingTab.click();

        // Also dispatch a proper click event
        followingTab.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));

        // Wait a bit and verify the selection worked
        await delay(200);

        if (isFollowingTabSelected()) {
          console.log('X Following Tab: Successfully selected Following tab');
          return true;
        } else {
          console.warn('X Following Tab: Click registered but tab not selected');
          return false;
        }
      } catch (error) {
        console.error('X Following Tab: Error clicking Following tab:', error);
        return false;
      }
    } else {
      console.debug('X Following Tab: Following tab not found, retrying...');
      return false;
    }
  }

  /**
   * Retry mechanism for selecting the Following tab
   */
  async function retrySelectFollowingTab() {
    if (retryCount >= CONFIG.maxRetries) {
      console.warn('X Following Tab: Max retries reached, giving up');
      return;
    }

    retryCount++;
    console.debug(`X Following Tab: Retry attempt ${retryCount}/${CONFIG.maxRetries}`);

    const success = await selectFollowingTab();

    if (!success) {
      setTimeout(retrySelectFollowingTab, CONFIG.retryDelay);
    } else {
      hasTriedSelection = true;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  }

  /**
   * Initialize the Following tab selection process
   */
  function initFollowingTabSelection() {
    // Only proceed if this is a fresh navigation
    if (!isFreshNavigation()) {
      console.debug('X Following Tab: Not a fresh navigation, skipping');
      return;
    }

    if (hasTriedSelection) {
      console.debug('X Following Tab: Already tried selection, skipping');
      return;
    }

    console.log('X Following Tab: Starting Following tab selection process');

    // Try immediate selection
    selectFollowingTab().then(success => {
      if (success) {
        hasTriedSelection = true;
        return;
      }

      // If immediate selection failed, set up observer and retry mechanism
      console.debug('X Following Tab: Setting up DOM observer');

      if (observer) {
        observer.disconnect();
      }

      observer = new MutationObserver((mutations) => {
        // Check if Following tab is now available
        const followingTab = findFollowingTab();
        if (followingTab && !hasTriedSelection) {
          console.debug('X Following Tab: Following tab detected via observer');
          retrySelectFollowingTab();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-selected', 'class', 'data-selected']
      });

      // Start retry attempts
      setTimeout(retrySelectFollowingTab, CONFIG.retryDelay);

      // Clean up observer after timeout
      setTimeout(() => {
        if (observer) {
          observer.disconnect();
          observer = null;
          console.debug('X Following Tab: Observer timeout reached');
        }
      }, CONFIG.observerTimeout);
    });
  }

  /**
   * Initialize the extension
   */
  function init() {
    console.log('X Following Tab Auto-Select: Extension initialized');

    // Handle initial page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFollowingTabSelection);
    } else {
      // Use a small delay to ensure the page is fully loaded
      setTimeout(initFollowingTabSelection, 100);
    }
  }

  // Start the extension
  init();

})();