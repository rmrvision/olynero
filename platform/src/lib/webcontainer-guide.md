
# WebContainer Implementation Guide

## Goal
Enable Olynero AI to run generated React/Next.js code directly in the user's browser without a backend dev server.

## Architecture

1. **Singleton WebContainer Instance**: We need a single instance of `WebContainer` to persist across re-renders.
2. **Virtual File System**: The agent's output (files) needs to be written to the WebContainer's file system.
3. **Terminal Output**: We use `xterm.js` to show the build logs (npm install, npm run dev) to the user, enhancing the "developer" feel.
4. **Iframe Preview**: The WebContainer exposes a URL (e.g., localhost:5173) which we display in an iframe.

## Steps

### 1. Singleton Instance (`src/lib/webcontainer.ts`)
```typescript
import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer;

export async function getWebContainer() {
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot();
  }
  return webcontainerInstance;
}
```

### 2. Terminal Component (`src/components/preview/terminal.tsx`)
A simple wrapper around `xterm.js` to display logs.

### 3. Preview Logic (`src/components/preview/preview-panel.tsx`)
- On mount: Boot WebContainer.
- On file change (from Agent): `webcontainer.mount(files)`.
- Initial run: `npm install` && `npm run dev`.
- Listen for `server-ready` event and update iframe URL.

## Challenges
- **Headers**: WebContainers require `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin` headers. We MUST configure `next.config.ts` to send these.
