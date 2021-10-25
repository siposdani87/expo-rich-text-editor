/// <reference types="react" />
export default function RichTextEditor(props: {
    value: string;
    onValueChange: (_value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    selectionColor?: string;
    actionMap?: any;
    minHeight?: number;
    linkStyle?: any;
    editorStyle?: any;
    toolbarStyle?: any;
    disabled?: boolean;
    debug?: boolean;
}): JSX.Element;
