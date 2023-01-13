import React, { useCallback } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import RichTextEditor from './RichTextEditor';

export default function RichTextViewer(props: {
    value: string;
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
            linkStyle={props.linkStyle}
            editorStyle={props.viewerStyle}
            debug={props.debug}
            disabled={true}
        />
    );
}
