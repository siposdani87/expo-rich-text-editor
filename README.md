# @siposdani87/expo-rich-text-editor

[![npm package](https://img.shields.io/npm/v/@siposdani87/expo-rich-text-editor.svg)](https://https://www.npmjs.com/package/@siposdani87/expo-rich-text-editor)

<a href="https://www.buymeacoffee.com/siposdani87" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="width: 150px !important;"></a>

This rich text editor written in TypeScript and use React Hooks structure. This component use the HTML ContentEditable div feature and React communicate and send data to native JavaScript via WebView. It has base editing options.

## Getting Started

### Installing

```
npm install @siposdani87/expo-rich-text-editor

# Expo
expo install @siposdani87/expo-rich-text-editor
```

### Basic Usage

```js
import { RichTextEditor, RichTextViewer } from '@siposdani87/expo-rich-text-editor';

export const RichTextComponents = () => {
    return (
        <>
            <RichTextViewer html={value} editorStyle={styles.editorViewer} linkStyle={styles.linkStyle} />
        </>
    );
};
```

### Props

#### RichTextEditor

#### RichTextViewer

## Preview
![Overview](https://raw.githubusercontent.com/siposdani87/expo-rich-text-editor/master/doc/images/expo-rich-text-editor.png)

## Bugs or Requests

If you encounter any problems feel free to open an [issue](https://github.com/siposdani87/expo-rich-text-editor/issues/new?template=bug_report.md). If you feel the library is missing a feature, please raise a [ticket](https://github.com/siposdani87/expo-rich-text-editor/issues/new?template=feature_request.md). Pull request are also welcome.
