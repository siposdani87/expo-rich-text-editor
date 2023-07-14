import React, { useCallback } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import RichTextEditor from './RichTextEditor';

export default function RichTextViewer(props: {
    value: string;
    onClickLink?: (url: string) => void;
    linkStyle?: StyleProp<TextStyle>;
    viewerStyle?: StyleProp<TextStyle>;
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
            editorStyle={props.viewerStyle}
            debug={props.debug}
            disabled={true}
        />
    );
}
