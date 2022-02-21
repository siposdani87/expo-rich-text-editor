/// <reference types="react" />
import { StyleProp, TextStyle } from 'react-native';
export default function RichTextViewer(props: {
    value: string;
    linkStyle?: StyleProp<TextStyle>;
    editorStyle?: StyleProp<TextStyle>;
    debug?: boolean;
}): JSX.Element;
