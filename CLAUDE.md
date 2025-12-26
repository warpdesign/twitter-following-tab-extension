# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that automatically selects the "Following" tab when navigating to X.com (formerly Twitter) from external sources. The extension only activates on fresh navigation (bookmarks, address bar, external links) and works across all languages using language-agnostic detection methods.

## Development Commands

```bash
# Install development dependencies (optional)
npm install

# Build the extension for development/testing
npm run build

# Build for production and create distributable zip
npm run build:prod

# Development with file watching (requires fswatch)
npm run dev

# Lint JavaScript files
npm run lint

# Clean build artifacts
npm run clean

# Show instructions for loading extension in Chrome
npm run test-load
```

## Project Structure

```
├── manifest.json           # Chrome extension manifest v3
├── content-script.js       # Main content script for X.com
├── popup/
│   ├── popup.html         # Extension popup interface
│   └── popup.js           # Popup logic with status checking
├── icons/                 # Extension icons (16, 32, 48, 128px)
├── dist/                  # Built extension files (generated)
├── package.json           # Development scripts and metadata
└── README.md              # User documentation
```

## Core Functionality

### Content Script (content-script.js:1-300)
The main logic uses language-agnostic tab detection:

1. **Fresh Navigation Detection**: Only activates on external navigation using `document.referrer` analysis
2. **Position-Based Tab Finding**: Locates the Following tab as typically the second `/home` link in navigation
3. **Multiple Detection Strategies**: Uses various selectors to handle UI changes
4. **Retry Mechanism**: Implements retry logic with MutationObserver for dynamic content
5. **Safe Activation**: Checks if already on Following tab to avoid unnecessary clicks

### Key Functions:
- `findFollowingTab()`: Language-agnostic tab detection using position and structure
- `isFreshNavigation()`: Determines if navigation is from external source
- `isOnHomePage()`: Checks if on X.com home page where tabs exist
- `selectFollowingTab()`: Safely clicks the Following tab with verification

## Extension Architecture

### Manifest V3 Configuration:
- Uses `activeTab` permission for minimal privacy impact
- Host permissions for `x.com` and `twitter.com`
- Content script runs at `document_idle` for optimal performance
- Simple popup interface showing extension status

### Detection Strategy:
The extension works by:
1. Identifying tab containers (`div[role="tablist"]`, navigation elements)
2. Finding home links (`a[href="/home"]`) within those containers
3. Selecting the second home link (Following tab) using position-based logic
4. Falling back to multiple selector strategies if primary method fails

### Language Independence:
- No text-based detection (no "Following", "For You" string matching)
- Uses DOM structure and ARIA attributes
- Position-based identification (Following is typically second tab)
- Multiple fallback strategies for UI variations

## Development Notes

### Testing:
1. Load unpacked extension in Chrome from `dist/` folder
2. Test on both x.com and twitter.com
3. Verify activation only on fresh navigation (not internal X.com navigation)
4. Test in different languages by changing X.com language settings

### Browser Compatibility:
- Currently Chrome only (Manifest V3)
- Future versions planned for Firefox and Safari

### Error Handling:
- Null checks for DOM elements throughout
- Try-catch blocks for URL parsing and DOM operations
- Console logging for debugging (can be removed in production)
- Graceful degradation when elements not found