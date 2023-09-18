import React, { useCallback } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import RichTextEditor from './RichTextEditor';

export default function RichTextViewer(props: {
    value: string;
    onClickLink?: (url: string) => void;
    linkStyle?: StyleProp<TextStyle>;
    textStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    debug?: boolean;
}) {
    const onValueChange = useCallback(() => {
        // empty onValueChange
    }, []);

    return (
        <RichTextEditor
            value={props.value}
            onValueChange={onValueChange}
            onClickLink={props.onClickLink}
            linkStyle={props.linkStyle}
            textStyle={props.textStyle}
            containerStyle={props.containerStyle}
            debug={props.debug}
            disabled={true}
        />
    );
}
