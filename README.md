# @siposdani87/expo-rich-text-editor

[![Version](https://img.shields.io/npm/v/@siposdani87/expo-rich-text-editor.svg?style=square)](https://www.npmjs.com/package/@siposdani87/expo-rich-text-editor)
[![Download](https://img.shields.io/npm/dt/@siposdani87/expo-rich-text-editor.svg?style=square)](https://www.npmjs.com/package/@siposdani87/expo-rich-text-editor)
[![License](https://img.shields.io/npm/l/@siposdani87/expo-rich-text-editor.svg?style=square)](./LICENSE)

<a href="https://www.buymeacoffee.com/siposdani87" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" style="width: 150px !important;"></a>

This rich text editor written in TypeScript and use React Hooks structure. This component use the HTML ContentEditable div feature and React communicate and send data to native JavaScript via WebView. It has base editing options.

## Getting Started

### Installing

```bash
npm install @siposdani87/expo-rich-text-editor
```

### Basic Usage

Check example directory for more samples and options.

```typescript
import { MaterialIcons } from '@expo/vector-icons';
import { RichTextEditor, RichTextViewer, ActionMap, ActionKey } from '@siposdani87/expo-rich-text-editor';

const htmlStr = '<p><i><u>Underline italic text</u></i> <b>bold word</b> normal words</p>';

export const RichTextComponents = () => {
    const [value, setValue] = useState('');

    const getColor = (selected: boolean): string => {
      return selected ? 'red' : 'black';
    };

    const getActionMap = (): ActionMap => {
        return {
            [ActionKey.bold]: ({ selected }) => (
                <MaterialIcons
                    name="format-bold"
                    size={14}
                    color={getColor(selected)}
                />
            ),
        };
    };

    const onValueChange = (v: string): void => {
        console.log('onValueChange', v);
        setValue(v);
    };

    return (
        <>
            <RichTextEditor
                minHeight={150}
                value={value}
                selectionColor="green"
                actionMap={getActionMap()}
                onValueChange={onValueChange}
                toolbarStyle={styles.toolbar}
                editorStyle={styles.editor}
            />

            <RichTextViewer value={htmlStr} viewerStyle={styles.viewer} linkStyle={styles.link} />
        </>
    );
};

const styles = StyleSheet.create({
    viewer: {
        borderColor: 'green',
        borderWidth: 1,
        padding: 5,
        // fontFamily: 'Oswald_400Regular',
    },
    editor: {
        borderColor: 'blue',
        borderWidth: 1,
        padding: 5,
        // fontFamily: 'Inter_500Medium',
        fontSize: 18,
    },
    toolbar: {
        borderColor: 'red',
        borderWidth: 1,
    },
    link: {
        color: 'green',
    },
});
```

## Props

### RichTextEditor

| Prop            | Type                    | Description |
| --------------- | ----------------------- | ----------- |
| value *         | string                  | HTML string with standard tags e.g.: p, b, strong, i, em, u, a, br |
| onValueChange * | (value: string) => void | Call this function on value changed |
| onFocus         | () => void              | Call this function on component focus |
| onBlur          | () => void              | Call this function on component blur |
| actionMap       | ActionMap               | Action config for toolbar component |
| editorStyle     | Style                   | Style for editor container |
| linkStyle       | Style                   | Style for link (a tag) |
| toolbarStyle    | Style                   | Style for toolbar container |
| selectionColor  | string                  | Color of text selection |
| minHeight       | number                  | Min height of container |
| disabled        | boolean                 | Disable editing on component |
| debug           | boolean                 | Print debug information to console |

### RichTextViewer

| Prop        | Type    | Description |
| ----------- | ------- | ----------- |
| value *     | string  | HTML string with standard tags eg.: p, b, strong, i, em, u, a, ul, ol, li, br |
| viewerStyle | Style   | Style for viewer container |
| linkStyle   | Style   | Style for link (a tag) |
| debug       | boolean | Print debug information to console |

## Preview

![Overview](https://raw.githubusercontent.com/siposdani87/expo-rich-text-editor/master/images/expo-rich-text-editor.png)

## Bugs or Requests

If you encounter any problems feel free to open an [issue](https://github.com/siposdani87/expo-rich-text-editor/issues/new?template=bug_report.md). If you feel the library is missing a feature, please raise a [ticket](https://github.com/siposdani87/expo-rich-text-editor/issues/new?template=feature_request.md). Pull request are also welcome.

## Developer

[Dániel Sipos](https://siposdani87.com)

## Sponsors

This project is generously supported by [TrophyMap](https://trophymap.org), [I18Nature](https://i18nature.com), and several other amazing organizations.
