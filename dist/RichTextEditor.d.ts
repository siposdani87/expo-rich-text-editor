/// <reference types="react" />
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ActionMap } from './RichTextToolbar';
export default function RichTextEditor(props: {
    value: string;
    onValueChange: (_value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onClickLink?: (_url: string) => void;
    selectionColor?: string;
    actionMap?: ActionMap;
    minHeight?: number;
    linkStyle?: StyleProp<TextStyle>;
    editorStyle?: StyleProp<TextStyle>;
    toolbarStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    debug?: boolean;
}): JSX.Element;
