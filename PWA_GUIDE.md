# PWA (Progressive Web App) Guide

## Overview

synaptiCITY is now a fully-featured Progressive Web App! This means users can install it on their devices and use it offline, providing a native app-like experience.

## Features Implemented

### ✅ Core PWA Features

1. **Web App Manifest** (`/public/manifest.json`)
   - App name, description, and branding
   - Icons (192x192 and 512x512)
   - Display mode: standalone (full-screen app)
   - Theme color: #38bdf8 (cyan)
   - App shortcuts to Simulation and Community tabs
   - Screenshots for app stores

2. **Service Worker** (`/public/sw.js`)
   - Static asset caching
   - Network-first strategy for API requests
   - Cache-first strategy for static resources
   - Automatic cache updates
   - Background sync for offline operations
   - Push notifications support
   - IndexedDB for pending operations

3. **Install Prompt** (`PWAInstallPrompt.tsx`)
   - Smart install banner (shows after 3 seconds)
   - iOS-specific installation instructions
   - "Not now" dismissal (reappears after 7 days)
   - Animated slide-up presentation
   - Desktop and mobile detection

4. **Offline Support**
   - Offline banner when connection is lost
   - Cached content works without internet
   - Automatic reconnection detection
   - Update notification when new version available
   - Background sync for pending network operations

5. **Service Worker Hooks** (`useServiceWorker.ts`)
   - Registration and lifecycle management
   - Update detection and notification
   - Online/offline status tracking
   - Installed PWA detection

### 📱 Mobile Optimizations

1. **Touch Gestures** (`useTouchGestures.ts`)
   - Swipe left/right/up/down support
   - Pinch-to-zoom gesture
   - Double-tap detection
   - Configurable threshold

2. **Mobile CSS Enhancements**
   - Safe area insets (notch/status bar)
   - Prevent pull-to-refresh
   - Touch-friendly tap targets (44x44px minimum)
   - Smooth scrolling for iOS
   - No zoom on input focus
   - High-performance transforms
   - Landscape mode optimizations

3. **iOS-Specific Features**
   - Apple touch icon
   - Web app capable meta tags
   - Status bar styling
   - Safe area padding

## Installation Instructions

### Desktop (Chrome/Edge/Brave)

1. Visit https://synapti-city.vercel.app
2. Look for the install icon in the address bar (⊕ or computer icon)
3. Click "Install synaptiCITY"
4. App opens in its own window

**OR**

1. Wait for the install prompt to appear
2. Click "Install" button
3. App opens automatically

### Mobile (Android)

1. Visit https://synapti-city.vercel.app in Chrome
2. Tap the menu (⋮) → "Add to Home Screen"
3. Confirm installation
4. App icon appears on home screen

**OR**

1. Wait for the install banner
2. Tap "Install"
3. App opens in full-screen mode

### Mobile (iOS/Safari)

1. Visit https://synapti-city.vercel.app in Safari
2. Tap the Share button (□↑)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right
5. App icon appears on home screen

## Offline Capabilities

### What Works Offline?

✅ **Full Functionality:**
- Neural network simulation
- Teaching and recall
- 3D visualization
- All educational features
- Achievement tracking
- Challenge mode
- Previously viewed community networks

❌ **Requires Internet:**
- Community library (loading new networks)
- Sharing networks
- Submitting networks
- Leaderboard updates
- User authentication
- Admin dashboard

### Automatic Sync

When you go back online, the app will:
- Sync pending network submissions
- Update cached community content
- Refresh leaderboard data
- Show update notification if new version available

## Update Process

### Automatic Updates

1. Service worker checks for updates every minute
2. When new version detected, blue banner appears at top
3. Click "Update Now" to reload with latest version
4. Or dismiss and update later (will auto-update on next visit)

### Manual Update

1. Force refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. Or: Developer Tools → Application → Service Workers → "Update"

## Performance Benefits

### Load Times

- **First Visit:** ~600KB JS, ~107KB CSS
- **Return Visits:** Instant (cached assets)
- **Offline:** Instant (fully cached)

### Data Usage

- **Initial:** ~700KB download
- **Updates:** Only changed files (~10-50KB typically)
- **Offline:** 0KB (no network requests)

## Development

### Testing PWA Locally

```bash
# Build production version
npm run build

# Serve with HTTPS (required for service workers)
npx serve dist -s -p 3000

# Or use http-server
npx http-server dist -p 3000 -c-1
```

**Note:** Service workers require HTTPS or localhost.

### Testing Service Worker

1. Open DevTools → Application → Service Workers
2. Check "Update on reload"
3. Check "Bypass for network"
4. Simulate offline: DevTools → Network → "Offline"

### Debugging

```javascript
// Check if PWA is installed
console.log('PWA installed:', window.matchMedia('(display-mode: standalone)').matches);

// Check service worker status
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW status:', reg?.active?.state);
});

// Check cache contents
caches.open('synaptiCITY-v1').then(cache => {
  cache.keys().then(keys => console.log('Cached:', keys.map(k => k.url)));
});
```

### Cache Version Updates

When updating the app, increment the cache version in `public/sw.js`:

```javascript
const CACHE_NAME = 'synaptiCITY-v2'; // Increment version
```

This forces cache refresh for all users.

## Browser Support

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Install | ✅ | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ❌ | ✅ |
| Background Sync | ✅ | ✅ | ❌ | ❌ |
| Shortcuts | ✅ | ✅ | ❌ | ❌ |

## Best Practices

### For Users

1. Install the app for best performance
2. Keep app updated (check for update banner)
3. Allow notifications for engagement reminders
4. Works best on WiFi for initial install

### For Developers

1. Always test offline mode
2. Keep service worker cache updated
3. Use network-first for API requests
4. Cache-first for static assets
5. Provide fallback UI for offline features
6. Test on real devices (not just simulators)

## Troubleshooting

### App Won't Install

- **Desktop:** Check if browser supports PWA install
- **iOS:** Must use Safari (not Chrome/Firefox)
- **Android:** Clear browser cache and try again

### Not Working Offline

- Visit the app online first (to cache assets)
- Check: DevTools → Application → Cache Storage
- Unregister and re-register service worker

### Updates Not Appearing

- Hard refresh: Ctrl+Shift+R
- Clear site data: Settings → Site Settings → Clear Data
- Uninstall and reinstall the app

### iOS Issues

- Ensure using Safari (only browser with install support)
- Check "Add to Home Screen" is enabled in Safari settings
- Try restarting browser

## Future Enhancements

### Planned Features

- [ ] Push notifications for achievements
- [ ] Background sync for network submissions
- [ ] Periodic background sync for leaderboard
- [ ] Share target (share TO synaptiCITY from other apps)
- [ ] File handling (open .syn files)
- [ ] Shortcuts (jump list on Windows)
- [ ] Badging API (unread notifications count)

### Performance Improvements

- [ ] Code splitting (reduce initial bundle)
- [ ] Lazy loading for tabs
- [ ] Image optimization
- [ ] Precache critical resources only
- [ ] Route-based caching strategies

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA](https://web.dev/progressive-web-apps/)
- [Workbox (Service Worker Library)](https://developers.google.com/web/tools/workbox)
- [PWA Builder](https://www.pwabuilder.com/)

## Testing Checklist

- [ ] Manifest validates (Chrome DevTools → Application → Manifest)
- [ ] Service worker registers successfully
- [ ] Install prompt appears on desktop
- [ ] Install prompt appears on mobile
- [ ] iOS instructions show correctly
- [ ] App installs on desktop
- [ ] App installs on Android
- [ ] App installs on iOS
- [ ] Offline mode works
- [ ] Update notification appears
- [ ] Cache updates properly
- [ ] Touch gestures work on mobile
- [ ] Safe area insets work on notched devices
- [ ] No console errors
- [ ] Lighthouse PWA score > 90
