import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import {
    WebViewErrorEvent,
    WebViewMessageEvent,
} from 'react-native-webview/lib/WebViewTypes';

import RichTextToolbar, {
    ActionKey,
    RichTextToolbarHandle,
} from './RichTextToolbar';
import HTML from './editor';
import {
    useEditorActions,
    useEditorInitialization,
    useMessageHandler,
    useSelectedActionKeys,
    useSendAction,
} from './hooks';
import { RichTextEditorProps } from './types';

// let htmlSource = require('./editor.html');
// if (Platform.OS === 'android' || Platform.OS === 'web') {
const htmlSource = { html: HTML };
// }

export default function RichTextEditor(props: RichTextEditorProps) {
    const containerStyle = StyleSheet.flatten<ViewStyle>(props.containerStyle);
    const textStyle = StyleSheet.flatten<TextStyle>(props.textStyle);
    const linkStyle = StyleSheet.flatten<TextStyle>(props.linkStyle);
    const [inited, setInited] = useState<boolean>(false);
    const [minHeight] = useState<number>(props.minHeight ?? 40);
    const webViewRef = useRef<WebView>(null);
    const toolbarRef = useRef<RichTextToolbarHandle>(null);

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

    const { selectedActionKeys, handleSelectedActionKeys } =
        useSelectedActionKeys();

    const postMessage = useCallback(
        (message: string): void => {
            webViewRef.current?.postMessage(message);
        },
        [webViewRef],
    );

    const { sendAction } = useSendAction({ postMessage });

    const onMessage = ({ nativeEvent }: WebViewMessageEvent): void => {
        handleMessage(nativeEvent.data);
    };

    const onLoad = (): void => {
        setInited(true);
    };

    const onError = ({ nativeEvent }: WebViewErrorEvent): void => {
        console.warn('WebView error: ', nativeEvent);
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
                <WebView
                    ref={webViewRef}
                    source={htmlSource}
                    style={[styles.webView, { height }]}
                    textZoom={100}
                    scrollEnabled={false}
                    hideKeyboardAccessoryView
                    keyboardDisplayRequiresUserAction={false}
                    onMessage={onMessage}
                    originWhitelist={['*']}
                    dataDetectorTypes={['none']}
                    bounces={false}
                    onLoad={onLoad}
                    onError={onError}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    editorContainer: {
        flex: 1,
    },
    webView: {
        flex: 0,
        backgroundColor: 'transparent',
    },
});
