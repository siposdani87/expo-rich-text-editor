import React from 'react';
import RichTextEditor from './RichTextEditor';
export default function RichTextViewer(props) {
    function onValueChange() {
        // empty onValueChange
    }
    return (<RichTextEditor value={props.html} onValueChange={onValueChange} linkStyle={props.linkStyle} editorStyle={props.editorStyle} debug={props.debug} disabled={true}/>);
}
//# sourceMappingURL=RichTextViewer.js.map