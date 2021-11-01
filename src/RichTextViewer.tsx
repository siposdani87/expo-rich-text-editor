import React, { useCallback } from 'react';
import RichTextEditor from './RichTextEditor';

export default function RichTextViewer(props: {
    value: string;
    linkStyle?: any;
    editorStyle?: any;
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
