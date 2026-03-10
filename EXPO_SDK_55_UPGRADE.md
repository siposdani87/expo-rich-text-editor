# Expo SDK 55 Upgrade Plan

## Key SDK 55 changes

- **React Native 0.83.4** (from 0.81.5), **React 19.2.4** (from 19.1)
- **New Architecture is now mandatory** (Legacy Architecture dropped)
- No breaking changes in react-native-webview — our WebView bridge is compatible
- RN 0.83 has zero user-facing breaking changes

## Step 1: Library root — `package.json`

### peerDependencies

| Package | Current | New |
|---------|---------|-----|
| `expo` | `>=54.0.0` | `>=55.0.0` |
| `react` | `>=19.0.0` | `>=19.0.0` (no change) |
| `react-native` | `>=0.81.0` | `>=0.83.0` |
| `react-native-webview` | `>=13.0.0` | `>=13.0.0` (no change) |

### devDependencies

| Package | Current | New |
|---------|---------|-----|
| `expo` | `~54.0.33` | `~55.0.5` |
| `react` | `~19.1.0` | `~19.2.4` |
| `react-native` | `~0.81.5` | `~0.83.4` |
| `react-native-webview` | `^13.16.0` | `^13.16.0` (no change) |
| `@types/react` | `^19.2.7` | `^19.2.14` |
| `react-test-renderer` | `^19.1.0` | `^19.2.4` |

## Step 2: Example app — `example/package.json`

### dependencies

| Package | Current | New |
|---------|---------|-----|
| `expo` | `~54.0.33` | `~55.0.5` |
| `react` | `^19.1.0` | `^19.2.4` |
| `react-dom` | `^19.1.0` | `^19.2.4` |
| `react-native` | `^0.81.5` | `^0.83.4` |
| `@expo/metro-runtime` | `~6.1.2` | `~55.0.6` |
| `expo-dev-client` | `~6.0.20` | `~55.0.13` |
| `expo-font` | `~14.0.11` | `~55.0.4` |
| `expo-splash-screen` | `~31.0.13` | `~55.0.10` |
| `expo-status-bar` | `~3.0.9` | `~55.0.4` |
| `react-native-safe-area-context` | `~5.6.0` | `~5.7.0` |
| `react-native-web` | `^0.21.2` | `^0.21.2` (no change) |

### devDependencies

| Package | Current | New |
|---------|---------|-----|
| `babel-preset-expo` | `~54.0.10` | `~55.0.10` |
| `jest-expo` | `~54.0.17` | `~55.0.9` |
| `@types/react` | `~19.1.10` | `~19.2.14` |

## Step 3: Documentation updates

- **README.md** — Update compatibility table: `Expo SDK >= 55`, `React Native >= 0.83`
- **README.md** — Add migration guide section for 1.2.x → 1.3.0
- **README.md** — Note New Architecture is now **required** (not just supported)
- **CHANGELOG.md** — Add 1.3.0 entry

## Step 4: Build & verify

1. `npm ci` in root — verify clean install
2. `npm run lint` — no errors
3. `npm run test` — all 18 tests pass
4. `npm run build` — TypeScript compiles, dist/ updated
5. `cd example && npm ci && npx expo install --fix && npm run tsc-test` — example app type-checks

## Risks

- **Low risk**: No WebView breaking changes, no RN 0.83 user-facing breaking changes
- **Medium risk**: Example app Expo packages need matching SDK 55 versions (`npx expo install --fix` to auto-resolve)
