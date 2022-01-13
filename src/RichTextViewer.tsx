import React, { useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import RichTextEditor from './RichTextEditor';

export default function RichTextViewer(props: {
    value: string;
    linkStyle?: StyleProp<ViewStyle>;
    editorStyle?: StyleProp<ViewStyle>;
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
            editorStyle={props.editorStyle}
            debug={props.debug}
            disabled={true}
        />
    );
}
