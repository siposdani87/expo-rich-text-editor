import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
export default function RichTextViewer(props: {
    value: string;
    onClickLink?: (url: string) => void;
    linkStyle?: StyleProp<TextStyle>;
    viewerStyle?: StyleProp<TextStyle>;
    debug?: boolean;
}): React.JSX.Element;
