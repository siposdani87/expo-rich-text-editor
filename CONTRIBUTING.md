# Contributing

Thank you for your interest in contributing to `@siposdani87/expo-rich-text-editor`!

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/siposdani87/expo-rich-text-editor.git
cd expo-rich-text-editor
```

2. Install dependencies:

```bash
npm ci
```

3. Build the library:

```bash
npm run build
```

4. Run the example app:

```bash
cd example
npm ci
npm run start
```

## Available Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run build`  | TypeScript compile to `dist/`        |
| `npm run lint`   | ESLint check                         |
| `npm run lint:fix` | ESLint auto-fix                    |
| `npm run format` | Prettier format `src/`               |
| `npm run clean`  | Remove `dist/`                       |

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure `npm run lint` and `npm run build` pass
4. Test on relevant platforms (iOS, Android, Web)
5. Update `CHANGELOG.md` if applicable
6. Open a pull request against `develop`

## Code Style

- 4-space indentation, single quotes, trailing commas, semicolons
- Follow the existing patterns in the codebase
- Run `npm run format` before committing
