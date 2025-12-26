# Twitter Following Tab Extension

A browser extension that automatically selects the "Following" tab when you navigate to X.com (formerly Twitter) from external sources, giving you your chronological timeline by default instead of the algorithmic "For You" feed.

## Features

- 🌍 **Language-agnostic**: Works in any language X.com is displayed in
- 🔗 **Smart activation**: Only works on fresh navigation (bookmarks, address bar, external links)
- 🚀 **Lightweight**: Minimal performance impact
- 🛡️ **Privacy-focused**: No data collection, works entirely locally
- ⚡ **Fast**: Uses efficient DOM detection methods

## How it works

The extension detects when you navigate to X.com from external sources and automatically clicks the "Following" tab instead of the default "For You" tab. It uses position-based detection to work across all languages and interface updates.

## Installation

### From Source (Development)

1. Clone or download this repository
2. Run `npm install` (optional, for development tools)
3. Run `npm run build` to build the extension
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode" in the top right
6. Click "Load unpacked" and select the `dist` folder
7. Navigate to X.com to test the functionality

## Development

```bash
# Install dependencies (optional)
npm install

# Build the extension
npm run build

# Build and create zip for distribution
npm run build:prod

# Development with file watching (requires fswatch)
npm run dev

# Lint the code
npm run lint

# Clean build artifacts
npm run clean
```

## How the extension activates

The extension only activates when:
- You navigate to x.com or twitter.com from your browser's address bar
- You click a bookmark to X.com
- You click a link to X.com from another website
- You are on the home page (`/` or `/home`)

The extension **does not** activate when:
- You navigate within X.com (clicking links, back/forward buttons)
- You're on other X.com pages (profiles, tweets, etc.)
- The "Following" tab is already selected

## Technical details

- Uses Chrome Extension Manifest V3
- Language-agnostic detection using structural selectors
- Position-based tab detection (Following is typically the second tab)
- Retry mechanism with DOM observation for dynamic content
- Minimal permissions (only `activeTab` and host permissions for x.com/twitter.com)

## Browser compatibility

Currently supports:
- Chrome (Manifest V3)

Future versions may support:
- Firefox (WebExtensions)
- Safari (Safari Web Extensions)

## License

MIT License - see the [LICENSE](LICENSE) file for details.