# Expo SDK 55 Upgrade Plan (COMPLETED)

## Key SDK 55 changes

- **React Native 0.83** (from 0.81), **React 19.2** (from 19.1)
- **New Architecture is now mandatory** (Legacy Architecture dropped)
- No breaking changes in react-native-webview — our WebView bridge is compatible
- RN 0.83 has zero user-facing breaking changes

## Step 1: Library root — `package.json`

### peerDependencies

| Package | Before | After |
|---------|--------|-------|
| `expo` | `>=54.0.0` | `>=55.0.0` |
| `react` | `>=19.0.0` | `>=19.0.0` (no change) |
| `react-native` | `>=0.81.0` | `>=0.83.0` |
| `react-native-webview` | `>=13.0.0` | `>=13.0.0` (no change) |

### devDependencies

| Package | Before | After |
|---------|--------|-------|
| `expo` | `~54.0.33` | `~55.0.5` |
| `react` | `~19.1.0` | `~19.2.4` |
| `react-native` | `~0.81.5` | `~0.83.4` |
| `react-native-webview` | `^13.16.0` | `^13.16.0` (no change) |
| `@types/react` | `^19.2.7` | `^19.2.14` |
| `react-test-renderer` | `^19.1.0` | `^19.2.4` |

## Step 2: Example app — `example/package.json`

`npx expo install --fix` resolved the actual SDK 55 pinned versions.

### dependencies

| Package | Before | After |
|---------|--------|-------|
| `expo` | `~54.0.33` | `~55.0.5` |
| `react` | `^19.1.0` | `19.2.0` |
| `react-dom` | `^19.1.0` | `19.2.0` |
| `react-native` | `^0.81.5` | `0.83.2` |
| `@expo/metro-runtime` | `~6.1.2` | `~55.0.6` |
| `expo-dev-client` | `~6.0.20` | `~55.0.13` |
| `expo-font` | `~14.0.11` | `~55.0.4` |
| `expo-splash-screen` | `~31.0.13` | `~55.0.10` |
| `expo-status-bar` | `~3.0.9` | `~55.0.4` |
| `react-native-safe-area-context` | `~5.6.0` | `~5.6.2` |
| `react-native-web` | `^0.21.2` | `^0.21.2` (no change) |
| `react-native-webview` | `^13.15.0` | `13.16.0` |

### devDependencies

| Package | Before | After |
|---------|--------|-------|
| `babel-preset-expo` | `~54.0.10` | `~55.0.10` |
| `jest-expo` | `~54.0.17` | `~55.0.9` |
| `@types/react` | `~19.1.10` | `~19.2.14` |

## Step 3: Example app — `example/metro.config.js` (new file)

Added Metro config to support the `file:../` symlink to the parent library:
- `watchFolders` — includes workspace root so Metro watches library source
- `nodeModulesPaths` — resolves from both example and root `node_modules`
- `extraNodeModules` — pins `react`, `react-native`, `react-dom` to example's copies to prevent duplicate React errors on iOS

## Step 4: Documentation updates

- **README.md** — Updated compatibility table: `Expo SDK >= 55`, `React Native >= 0.83`
- **README.md** — Added migration guide section for 1.2.x → 1.3.x
- **README.md** — Noted New Architecture is now **required** (not just supported)
- **CHANGELOG.md** — Added 1.3.0 entry
- **CLAUDE.md** — Updated SDK version, peer deps, test info, metro config notes

## Step 5: Build & verify

1. `npm install` in root — clean install ✅
2. `npm run lint` — no errors ✅
3. `npm run test` — all 18 tests pass ✅
4. `npm run build` — TypeScript compiles, dist/ updated ✅
5. `cd example && npm install && npx expo install --fix && npm run tsc-test` — example app type-checks ✅
6. `npx expo start --web` — web bundle builds successfully (405 modules) ✅
7. iOS simulator — requires updated Expo Go or dev build (SDK 55 Expo Go not installed) ⚠️
