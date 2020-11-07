import React from 'react';
import RichTextEditor from './RichTextEditor';

export default function RichTextViewer(props: { html: string, editorStyle?: any, debug?: boolean }) {
    function onValueChange() {

    }

    return (
        <RichTextEditor value={props.html} onValueChange={onValueChange} editorStyle={[props.editorStyle]} debug={props.debug} disabled={true} />
    );
}
