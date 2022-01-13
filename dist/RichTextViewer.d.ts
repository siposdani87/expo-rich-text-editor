/// <reference types="react" />
import { StyleProp, ViewStyle } from 'react-native';
export default function RichTextViewer(props: {
    value: string;
    linkStyle?: StyleProp<ViewStyle>;
    editorStyle?: StyleProp<ViewStyle>;
    debug?: boolean;
}): JSX.Element;
