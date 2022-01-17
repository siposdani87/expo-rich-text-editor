/// <reference types="react" />
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
export default function RichTextViewer(props: {
    value: string;
    linkStyle?: StyleProp<TextStyle>;
    editorStyle?: StyleProp<ViewStyle>;
    debug?: boolean;
}): JSX.Element;
