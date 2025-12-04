import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { ActionKey } from './RichTextToolbar';
export function useEditorActions(params) {
    const [value, setValue] = useState('');
    const [height, setHeight] = useState(params.minHeight);
    const actions = {
        changeHtml: (html) => {
            setValue(html);
            params.onValueChange(html);
        },
        changeHeight: (newHeight) => {
            if (newHeight < params.minHeight) {
                newHeight = params.minHeight;
            }
            const offset = params.textStyle?.fontSize ?? 16;
            setHeight(newHeight + offset);
        },
        onClickLink: (url) => {
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
        log: (message) => {
            if (params.debug) {
                console.log(message);
            }
        },
    };
    return { actions, value, setValue, height };
}
export function useMessageHandler(params) {
    const handleMessage = useCallback((data) => {
        try {
            const message = JSON.parse(data);
            const action = params.actions[message?.type];
            if (action) {
                action(message.data);
            }
            else {
                console.warn(`Missing Actions.${message.type} method`);
            }
        }
        catch (e) {
            console.error('onMessage: ', e);
        }
    }, [params.actions]);
    return { handleMessage };
}
export function useSelectedActionKeys(_params) {
    const [selectedActionKeys, setSelectedActionKeys] = useState([]);
    const handleSelectedActionKeys = useCallback((actionKey) => {
        if (actionKey === ActionKey.code) {
            const contains = selectedActionKeys.includes(ActionKey.code);
            const actionKeys = contains ? [] : [ActionKey.code];
            setSelectedActionKeys(actionKeys);
        }
    }, [selectedActionKeys]);
    return { selectedActionKeys, handleSelectedActionKeys };
}
export function useSendAction(params) {
    const sendAction = useCallback((type, data) => {
        if (data === undefined || data === null) {
            return;
        }
        const message = JSON.stringify({ type, data });
        params.postMessage(message);
    }, [params.postMessage]);
    return { sendAction };
}
export function useEditorInitialization(params) {
    const { inited, value, textStyle, linkStyle, selectionColor, disabled, autoFocus, sendAction, } = params;
    useEffect(() => {
        if (inited) {
            sendAction('setHtml', value);
        }
    }, [inited, value, sendAction]);
    useEffect(() => {
        if (inited) {
            sendAction('setColor', textStyle?.color);
            sendAction('setFontFamily', textStyle?.fontFamily);
            sendAction('setFontSize', textStyle?.fontSize);
            sendAction('setLinkColor', linkStyle?.color);
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
//# sourceMappingURL=hooks.js.map