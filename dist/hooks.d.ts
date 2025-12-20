import { StyleProp, TextStyle } from 'react-native';
import { ActionKey } from './RichTextToolbar';
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
    sendAction: (type: string, data: any) => void;
};
export interface UseEditorInitializationParams {
    inited: boolean;
    value: string;
    textStyle?: StyleProp<TextStyle>;
    linkStyle?: StyleProp<TextStyle>;
    selectionColor?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    sendAction: (type: string, data: any) => void;
}
export declare function useEditorInitialization(params: UseEditorInitializationParams): void;
