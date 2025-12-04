import { useCallback, useEffect, useState } from 'react';
import { Linking, StyleProp, TextStyle } from 'react-native';

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
            const offset = (params.textStyle as any)?.fontSize ?? 16;
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
                ] as (_arg: any) => void;
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

    const handleSelectedActionKeys = useCallback((actionKey: ActionKey): void => {
        if (actionKey === ActionKey.code) {
            const contains = selectedActionKeys.includes(ActionKey.code);
            const actionKeys = contains ? [] : [ActionKey.code];
            setSelectedActionKeys(actionKeys);
        }
    }, [selectedActionKeys]);

    return { selectedActionKeys, handleSelectedActionKeys };
}

export interface UseSendActionParams {
    postMessage: (message: string) => void;
}

export function useSendAction(params: UseSendActionParams) {
    const sendAction = useCallback(
        (type: string, data: any): void => {
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
    sendAction: (type: string, data: any) => void;
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
            sendAction('setColor', (textStyle as any)?.color);
            sendAction('setFontFamily', (textStyle as any)?.fontFamily);
            sendAction('setFontSize', (textStyle as any)?.fontSize);
            sendAction('setLinkColor', (linkStyle as any)?.color);
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
