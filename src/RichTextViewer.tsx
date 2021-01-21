import React from 'react';
import RichTextEditor from './RichTextEditor';

export default function RichTextViewer(props: { html: string, linkStyle?: any, editorStyle?: any, debug?: boolean }) {
    function onValueChange() {
        // empty onValueChange
    }

    return (
        <RichTextEditor value={props.html} onValueChange={onValueChange} linkStyle={props.linkStyle} editorStyle={props.editorStyle} debug={props.debug} disabled={true} />
    );
}
