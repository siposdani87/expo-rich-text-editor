import React, { useCallback } from 'react';
import RichTextEditor from './RichTextEditor';
export default function RichTextViewer(props) {
    const onValueChange = useCallback(() => {
        // empty onValueChange
    }, []);
    return (<RichTextEditor value={props.value} onValueChange={onValueChange} onClickLink={props.onClickLink} linkStyle={props.linkStyle} editorStyle={props.viewerStyle} debug={props.debug} disabled={true}/>);
}
//# sourceMappingURL=RichTextViewer.js.map