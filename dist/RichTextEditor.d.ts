/// <reference types="react" />
import { ActionMap } from './RichTextToolbar';
export default function RichTextEditor(props: {
    value: string;
    onValueChange: (_value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    selectionColor?: string;
    actionMap?: ActionMap;
    minHeight?: number;
    linkStyle?: any;
    editorStyle?: any;
    toolbarStyle?: any;
    disabled?: boolean;
    debug?: boolean;
}): JSX.Element;
