import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
export default function RichTextViewer(props: {
    value: string;
    onClickLink?: (url: string) => void;
    linkStyle?: StyleProp<TextStyle>;
    textStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    debug?: boolean;
}): React.JSX.Element;
