import { ColorValue, StyleProp, TextStyle } from 'react-native';
import { ActionKey } from './RichTextToolbar';
/** Messages sent from the editor (WebView/iframe) to React Native */
export type EditorToRNMessage = {
    type: 'changeHtml';
    data: string;
} | {
    type: 'changeHeight';
    data: number;
} | {
    type: 'onClickLink';
    data: string;
} | {
    type: 'onFocus';
    data?: undefined;
} | {
    type: 'onBlur';
    data?: undefined;
} | {
    type: 'log';
    data: string;
};
/** Commands sent from React Native to the editor (WebView/iframe) */
export type RNToEditorCommand = {
    type: 'setHtml';
    data: string;
} | {
    type: 'setColor';
    data: string;
} | {
    type: 'setFontFamily';
    data: string;
} | {
    type: 'setFontSize';
    data: number;
} | {
    type: 'setLinkColor';
    data: string;
} | {
    type: 'setSelectionColor';
    data: string;
} | {
    type: 'setDisabled';
    data: boolean;
} | {
    type: 'setAutoFocus';
    data: boolean;
} | {
    type: 'undo';
    data: string;
} | {
    type: 'redo';
    data: string;
} | {
    type: 'bold';
    data: string;
} | {
    type: 'italic';
    data: string;
} | {
    type: 'underline';
    data: string;
} | {
    type: 'orderedList';
    data: string;
} | {
    type: 'unorderedList';
    data: string;
} | {
    type: 'clear';
    data: string;
} | {
    type: 'code';
    data: string;
};
/** Generic message format for consumers */
export interface EditorMessage {
    type: string;
    data: unknown;
}
export interface EditorActions {
    changeHtml: (html: string) => void;
    changeHeight: (newHeight: number) => void;
    onClickLink: (url: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    log: (message: string) => void;
}
export interface UseEditorActionsParams {
    onValueChange: (value: string) => void;
    onClickLink?: (url: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    debug?: boolean;
    minHeight: number;
    textStyle?: StyleProp<TextStyle>;
}
export declare function useEditorActions(params: UseEditorActionsParams): {
    actions: EditorActions;
    value: string;
    setValue: import("react").Dispatch<import("react").SetStateAction<string>>;
    height: number;
};
export interface UseMessageHandlerParams {
    actions: EditorActions;
}
export declare function useMessageHandler(params: UseMessageHandlerParams): {
    handleMessage: (data: string) => void;
};
export interface UseSelectedActionKeysParams {
}
export declare function useSelectedActionKeys(_params?: UseSelectedActionKeysParams): {
    selectedActionKeys: ActionKey[];
    handleSelectedActionKeys: (actionKey: ActionKey) => void;
};
export interface UseSendActionParams {
    postMessage: (message: string) => void;
}
export declare function useSendAction(params: UseSendActionParams): {
    sendAction: (type: string, data: string | number | boolean | ColorValue | undefined) => void;
};
export interface UseEditorInitializationParams {
    inited: boolean;
    value: string;
    textStyle?: StyleProp<TextStyle>;
    linkStyle?: StyleProp<TextStyle>;
    selectionColor?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    sendAction: (type: string, data: string | number | boolean | ColorValue | undefined) => void;
}
export declare function useEditorInitialization(params: UseEditorInitializationParams): void;
//# sourceMappingURL=hooks.d.ts.map