import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import RichTextToolbar, { ActionKey } from './RichTextToolbar';
import HTML from './editor';
import {
    useEditorActions,
    useEditorInitialization,
    useMessageHandler,
    useSelectedActionKeys,
    useSendAction,
} from './hooks';
import { RichTextEditorProps } from './types';

export default function RichTextEditor(props: RichTextEditorProps) {
    const containerStyle = StyleSheet.flatten<ViewStyle>(props.containerStyle);
    const textStyle = StyleSheet.flatten<TextStyle>(props.textStyle);
    const linkStyle = StyleSheet.flatten<TextStyle>(props.linkStyle);
    const [inited, setInited] = useState<boolean>(false);
    const [minHeight] = useState<number>(props.minHeight ?? 40);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const toolbarRef = useRef<any>(null);

    const { actions, value, setValue, height } = useEditorActions({
        onValueChange: props.onValueChange,
        onClickLink: props.onClickLink,
        onFocus: props.onFocus,
        onBlur: props.onBlur,
        debug: props.debug,
        minHeight,
        textStyle,
    });

    const { handleMessage } = useMessageHandler({ actions });

    const { selectedActionKeys, handleSelectedActionKeys } = useSelectedActionKeys();

    const postMessage = useCallback(
        (message: string): void => {
            const iframe = iframeRef.current;
            if (iframe?.contentWindow) {
                iframe.contentWindow.postMessage(message, '*');
            }
        },
        [iframeRef],
    );

    const { sendAction } = useSendAction({ postMessage });

    const onMessage = useCallback(
        (event: MessageEvent): void => {
            // Only accept messages from our iframe
            if (event.source !== iframeRef.current?.contentWindow) {
                return;
            }

            handleMessage(event.data);
        },
        [handleMessage],
    );

    const onLoad = (): void => {
        setInited(true);
    };

    const onError = (): void => {
        console.warn('iframe error');
    };

    const onPress = (actionKey: ActionKey): void => {
        if (!props.disabled) {
            handleSelectedActionKeys(actionKey);
            sendAction(ActionKey[actionKey], '');
        }
    };

    useEffect(() => {
        setValue(props.value);
    }, [inited, props.value, setValue]);

    useEditorInitialization({
        inited,
        value,
        textStyle,
        linkStyle,
        selectionColor: props.selectionColor,
        disabled: props.disabled,
        autoFocus: props.autoFocus,
        sendAction,
    });

    // Setup message listener for iframe
    useEffect(() => {
        window.addEventListener('message', onMessage);
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, [onMessage]);

    return (
        <>
            {props.actionMap && (
                <RichTextToolbar
                    ref={toolbarRef}
                    style={props.toolbarStyle}
                    actionMap={props.actionMap}
                    selectedActionKeys={selectedActionKeys}
                    onPress={onPress}
                />
            )}
            <View style={[styles.editorContainer, containerStyle]}>
                <iframe
                    ref={iframeRef}
                    srcDoc={HTML}
                    style={{
                        width: '100%',
                        height,
                        border: 'none',
                        backgroundColor: 'transparent',
                    }}
                    onLoad={onLoad}
                    onError={onError}
                    title="Rich Text Editor"
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    editorContainer: {
        flex: 1,
    },
});
