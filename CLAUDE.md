# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An npm-published React Native rich text editor library (`@siposdani87/expo-rich-text-editor`) built for Expo SDK 54. Uses a WebView-based contentEditable approach with a JSON message bridge between React Native and an embedded HTML editor.

## Build & Development Commands

```bash
# Library (root)
npm run build          # TypeScript compile to dist/
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier format src/
npm run clean          # Remove dist/

# Example app (cd example/)
npm run start          # Start Expo dev client
npm run web            # Start Expo web
npm run ios            # Run on iOS
npm run android        # Run on Android
npm run tsc-test       # TypeScript type check (no emit)
```

No test suite exists — `npm test` is a no-op placeholder.

## Architecture

### Platform-specific editor rendering

The editor uses React Native's platform file extensions for cross-platform support:

- `RichTextEditor.native.tsx` — iOS/Android: renders via `react-native-webview` `<WebView>` with `postMessage`/`onMessage` bridge
- `RichTextEditor.web.tsx` — Web: renders via `<iframe>` with `window.postMessage`/`addEventListener('message')` bridge
- `RichTextEditor.tsx` — Default/fallback (identical to native)

Both platform implementations share the same hooks and embedded HTML editor.

### Communication bridge

`editor.ts` exports an HTML string containing a self-contained contentEditable editor with vanilla JS. Communication between React Native and the embedded editor uses JSON messages (`{type, data}`):

- **React → Editor**: `sendAction(type, data)` serializes to JSON, delivered via `postMessage`
- **Editor → React**: calls `sendAction` which routes through `ReactNativeWebView.postMessage` (native) or `window.parent.postMessage` (iframe)
- **Message handling**: `useMessageHandler` hook parses incoming messages and dispatches to `EditorActions` methods

### Hooks (`hooks.ts`)

All editor logic is extracted into composable hooks:
- `useEditorActions` — manages HTML value state, height calculation, and callback dispatching
- `useMessageHandler` — parses WebView/iframe messages into action calls
- `useSelectedActionKeys` — tracks active formatting state (bold, italic, etc.)
- `useSendAction` — serializes and sends commands to the embedded editor
- `useEditorInitialization` — syncs React props (value, styles, disabled) to editor on init/change

### Components

- `RichTextEditor` — full editor with WebView/iframe, toolbar support, and two-way data binding
- `RichTextToolbar` — horizontal FlatList of action buttons, uses `forwardRef` + `useImperativeHandle`
- `RichTextViewer` — read-only wrapper around RichTextEditor with `disabled` prop

## Code Style

- **Prettier**: 4-space indentation, single quotes, trailing commas, semicolons (`.prettierrc.json`)
- **ESLint**: `eslint-config-universe/native` with TypeScript parser (`.eslintrc.json`)
- **TypeScript**: strict mode, `noUnusedLocals`, `noUnusedParameters`

## Key Conventions

- Library is published as npm package — `peerDependencies` define compatibility (expo >=54, react >=18, react-native >=0.70, react-native-webview >=13)
- `dist/` is the build output included in the published package along with `src/`
- The `example/` directory is an independent Expo app that references the library via `"file:../"` symlink
- The root `package.json` has no `dependencies` — only `peerDependencies` and `devDependencies`
