import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ActionMap } from './RichTextToolbar';
export default function RichTextEditor(props: {
    value: string;
    onValueChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onClickLink?: (url: string) => void;
    selectionColor?: string;
    actionMap?: ActionMap;
    minHeight?: number;
    linkStyle?: StyleProp<TextStyle>;
    editorStyle?: StyleProp<TextStyle>;
    toolbarStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    autoFocus?: boolean;
    debug?: boolean;
}): React.JSX.Element;
