import { useCallback, useEffect, useState } from 'react';
import {
    ColorValue,
    Linking,
    StyleProp,
    StyleSheet,
    TextStyle,
} from 'react-native';

import { ActionKey } from './RichTextToolbar';

/** Messages sent from the editor (WebView/iframe) to React Native */
export type EditorToRNMessage =
    | { type: 'changeHtml'; data: string }
    | { type: 'changeHeight'; data: number }
    | { type: 'onClickLink'; data: string }
    | { type: 'onFocus'; data?: undefined }
    | { type: 'onBlur'; data?: undefined }
    | { type: 'log'; data: string };

/** Commands sent from React Native to the editor (WebView/iframe) */
export type RNToEditorCommand =
    | { type: 'setHtml'; data: string }
    | { type: 'setColor'; data: string }
    | { type: 'setFontFamily'; data: string }
    | { type: 'setFontSize'; data: number }
    | { type: 'setLinkColor'; data: string }
    | { type: 'setSelectionColor'; data: string }
    | { type: 'setDisabled'; data: boolean }
    | { type: 'setAutoFocus'; data: boolean }
    | { type: 'undo'; data: string }
    | { type: 'redo'; data: string }
    | { type: 'bold'; data: string }
    | { type: 'italic'; data: string }
    | { type: 'underline'; data: string }
    | { type: 'orderedList'; data: string }
    | { type: 'unorderedList'; data: string }
    | { type: 'clear'; data: string }
    | { type: 'code'; data: string };

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

export function useEditorActions(params: UseEditorActionsParams) {
    const [value, setValue] = useState<string>('');
    const [height, setHeight] = useState<number>(params.minHeight);

    const actions: EditorActions = {
        changeHtml: (html: string) => {
            setValue(html);
            params.onValueChange(html);
        },
        changeHeight: (newHeight: number) => {
            if (newHeight < params.minHeight) {
                newHeight = params.minHeight;
            }
            const flatStyle = StyleSheet.flatten<TextStyle>(params.textStyle);
            const offset = flatStyle?.fontSize ?? 16;
            setHeight(newHeight + offset);
        },
        onClickLink: (url: string) => {
            if (params.onClickLink) {
                return params.onClickLink(url);
            }
            Linking.openURL(url);
        },
        onFocus: () => {
            params.onFocus?.();
        },
        onBlur: () => {
            params.onBlur?.();
        },
        log: (message: string) => {
            if (params.debug) {
                console.log(message);
            }
        },
    };

    return { actions, value, setValue, height };
}

export interface UseMessageHandlerParams {
    actions: EditorActions;
}

export function useMessageHandler(params: UseMessageHandlerParams) {
    const handleMessage = useCallback(
        (data: string): void => {
            try {
                const message = JSON.parse(data);
                const action = params.actions[
                    message?.type as keyof typeof params.actions
                ] as ((_arg: string | number | boolean) => void) | undefined;
                if (action) {
                    action(message.data);
                } else {
                    console.warn(`Missing Actions.${message.type} method`);
                }
            } catch (e) {
                console.error('onMessage: ', e);
            }
        },
        [params.actions],
    );

    return { handleMessage };
}

export interface UseSelectedActionKeysParams {}

export function useSelectedActionKeys(_params?: UseSelectedActionKeysParams) {
    const [selectedActionKeys, setSelectedActionKeys] = useState<ActionKey[]>(
        [],
    );

    const handleSelectedActionKeys = useCallback(
        (actionKey: ActionKey): void => {
            if (actionKey === ActionKey.code) {
                const contains = selectedActionKeys.includes(ActionKey.code);
                const actionKeys = contains ? [] : [ActionKey.code];
                setSelectedActionKeys(actionKeys);
            }
        },
        [selectedActionKeys],
    );

    return { selectedActionKeys, handleSelectedActionKeys };
}

export interface UseSendActionParams {
    postMessage: (message: string) => void;
}

export function useSendAction(params: UseSendActionParams) {
    const sendAction = useCallback(
        (
            type: string,
            data: string | number | boolean | ColorValue | undefined,
        ): void => {
            if (data === undefined || data === null) {
                return;
            }

            const message = JSON.stringify({ type, data });
            params.postMessage(message);
        },
        [params.postMessage],
    );

    return { sendAction };
}

export interface UseEditorInitializationParams {
    inited: boolean;
    value: string;
    textStyle?: StyleProp<TextStyle>;
    linkStyle?: StyleProp<TextStyle>;
    selectionColor?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    sendAction: (
        type: string,
        data: string | number | boolean | ColorValue | undefined,
    ) => void;
}

export function useEditorInitialization(params: UseEditorInitializationParams) {
    const {
        inited,
        value,
        textStyle,
        linkStyle,
        selectionColor,
        disabled,
        autoFocus,
        sendAction,
    } = params;

    useEffect(() => {
        if (inited) {
            sendAction('setHtml', value);
        }
    }, [inited, value, sendAction]);

    useEffect(() => {
        if (inited) {
            const flatTextStyle = StyleSheet.flatten<TextStyle>(textStyle);
            const flatLinkStyle = StyleSheet.flatten<TextStyle>(linkStyle);
            sendAction('setColor', flatTextStyle?.color);
            sendAction('setFontFamily', flatTextStyle?.fontFamily);
            sendAction('setFontSize', flatTextStyle?.fontSize);
            sendAction('setLinkColor', flatLinkStyle?.color);
            sendAction('setSelectionColor', selectionColor);
        }
    }, [inited, textStyle, linkStyle, selectionColor, sendAction]);

    useEffect(() => {
        if (inited) {
            sendAction('setDisabled', !!disabled);
        }
    }, [inited, disabled, sendAction]);

    useEffect(() => {
        if (inited) {
            sendAction('setAutoFocus', !!autoFocus);
        }
    }, [inited, autoFocus, sendAction]);
}
