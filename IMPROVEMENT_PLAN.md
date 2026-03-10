# Open Source Improvement Plan

## Pre-Release

- [x] Bump version to 1.3.0 in `package.json`

## Current State (Overall ~8/10)

### Strengths

- README with badges, screenshot, props docs, example code
- Well-maintained CHANGELOG (23 versions tracked)
- Strict TypeScript config, ESLint + Prettier
- Clean package.json (no runtime deps, proper `files` field)
- Comprehensive example app
- MIT license

## Improvements (Priority Order)

### 1. CI/CD — GitHub Actions (High Impact)

- [x] Current `npm-publish.yml` uses Node 16, `actions/checkout@v3`, and `actions/setup-node@v3` with no pre-publish validation
- [x] Add a CI workflow (lint, type-check, build) on PRs and pushes
- [x] Add build/lint/type-check steps before `npm publish` in the publish workflow
- [x] Upgrade to Node 20 LTS and actions to v4

### 2. GitHub Templates (High Impact)

- [x] Add `.github/ISSUE_TEMPLATE/bug_report.md` and `feature_request.md` (README references these but they don't exist)
- [x] Add `.github/PULL_REQUEST_TEMPLATE.md`
- [x] Add `CODEOWNERS` file

### 3. Community Docs (Medium Impact)

- [x] `CONTRIBUTING.md` — contribution workflow, dev setup, PR process
- [x] `CODE_OF_CONDUCT.md` — Contributor Covenant (standard)
- [x] `SECURITY.md` — vulnerability reporting policy

### 4. README Enhancements (Medium Impact)

- [x] Expand API docs (all available actions, toolbar customization, styling)
- [x] Add advanced usage examples (custom toolbar, programmatic control)
- [x] Add "Supported Platforms" compatibility matrix
- [x] Add "Development" section for contributors

### 5. Testing (Medium-Long Term)

- [x] Add basic unit tests for hooks and message handling
- [x] Add CI step for test execution
- [x] Add snapshot tests for RichTextToolbar component

### 6. Developer Experience (Low-Medium Impact)

- [x] Add pre-commit hooks (husky + lint-staged)
- [x] Add `.nvmrc` with Node 20
- [x] Set up commitlint with conventional commits enforcement

## TypeScript Improvements

### 7. Narrow `any` Types (High Impact)

- [x] `RichTextEditor.tsx` — `webViewRef: useRef<any>` → `useRef<WebView>`, `toolbarRef: useRef<any>` → `useRef<RichTextToolbar>`
- [x] `RichTextEditor.native.tsx` — `webViewRef: useRef<any>` → `useRef<WebView>`, `toolbarRef: useRef<any>` → `useRef<RichTextToolbar>`
- [x] `RichTextEditor.web.tsx` — `toolbarRef: useRef<any>` → `useRef<RichTextToolbar>`
- [x] `RichTextToolbar.tsx` — `ref: any` parameter → proper forwardRef typing
- [x] `hooks.ts` — `(params.textStyle as any)?.fontSize` → extract TextStyle properties safely
- [x] `hooks.ts` — `(_arg: any) => void` → narrow message handler arg type
- [x] `hooks.ts` — `sendAction(type: string, data: any)` → typed `data` per action type
- [x] `hooks.ts` — `(textStyle as any)?.color`, `(textStyle as any)?.fontFamily`, `(textStyle as any)?.fontSize`, `(linkStyle as any)?.color` → extract style properties safely

### 8. Export Missing Types (Medium Impact)

- [x] Export message format type `{ type: string; data: unknown }` for consumers
- [x] Export toolbar imperative handle type (from `useImperativeHandle`)
- [x] Export `EditorActions` type (already exported)

### 9. Type-Safe Message Bridge (Medium Impact)

- [x] Define a discriminated union for all editor message types (editor → RN)
- [x] Define a discriminated union for all command types (RN → editor)
- [x] Add runtime validation in `onMessage` handler for unknown message shapes
- [ ] Type the vanilla JS `Actions` object in `editor.ts` HTML template (not feasible — vanilla JS inside template string)

## Package Modernization

### 10. package.json Fields (Medium Impact)

- [x] Add `exports` field with conditional exports for types/require/import
- [x] Add `sideEffects: false` for tree-shaking
- [x] Add `engines: { "node": ">=18" }`
- [x] Add `typesVersions` for older TypeScript consumers
- [x] Add `declarationMap: true` in tsconfig for better IDE navigation

### 11. Expo SDK Compatibility Indicator (Medium Impact)

- [x] Add an SDK compatibility table in README (SDK 54+, React 19+, RN 0.81+)
- [x] Explicitly state New Architecture (Fabric) support status
- [x] Add migration guide section for users upgrading from older SDK versions
- [x] Document `react-native-webview` version requirements per platform

## HTML Editor Quality

### 12. Editor Template Hardening (Low-Medium Impact)

- [x] Add runtime message validation in `editor.ts` `onMessage` handler
- [x] Validate `fontFamily.split('_', 3)` format assumption
- [x] Add error boundaries around `JSON.parse(event.data)` in both directions
- [x] Document the message protocol (type/data pairs) for contributors
