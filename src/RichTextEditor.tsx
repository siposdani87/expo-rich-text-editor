import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, Platform } from 'react-native';
import RichTextToolbar from './RichTextToolbar';

import { HTML } from './editor';
let htmlSource = require('./editor.html');
if (Platform.OS === 'android' || Platform.OS === 'web') {
    htmlSource = { html: HTML };
}

export default function RichTextEditor(props: { value: string, actionMap: {}, minHeight: number, onValueChange: (value: string) => void, editorStyle?: any, toolbarStyle?: any, disabled?: boolean, debug?: boolean }) {
    const webViewRef = useRef(null);
    const [inited, setInited] = useState(false);
    const [height, setHeight] = useState(props.minHeight);

    const Actions = {
        changeHtml: (html: string) => {
            props.onValueChange(html);
        },
        changeHeight: (h: number) => {
            if (h < props.minHeight) {
                h = props.minHeight;
            }
            setHeight(h + 30);
        },
        log: (message: string) => {
            if (props.debug) {
                console.log(message);
            }
        }
    };

    useEffect(() => {
        if (inited) {
            setHTML(props.value);
        }
    }, [inited, props.value]);

    useEffect(() => {
        if (inited && props.editorStyle && props.editorStyle.color) {
            setColor(props.editorStyle.color);
        }
    }, [inited, props.editorStyle]);

    useEffect(() => {
        if (inited) {
            setDisabled(!!props.disabled);
        }
    }, [inited, props.disabled]);

    function onMessage(event) {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            const action = Actions[message.type];
            if (action) {
                action(message.data);
            } else {
                console.warn(`Missing Actions.${message.type} method`)
            }
        } catch (e) {
            console.error('onMessage: ', e);
        }
    };

    function sendAction(type: string, data: any = null) {
        let message = JSON.stringify({ type, data });
        if (webViewRef.current) {
            webViewRef.current.postMessage(message);
        }
    }

    function setHTML(html: string) {
        sendAction('setHtml', html);
    }

    function setColor(color: string) {
        sendAction('setColor', color);
    }

    function setDisabled(disabled: boolean) {
        sendAction('setDisabled', disabled);
    }

    function onLoad() {
        setInited(true);
    }

    function onError(syntheticEvent) {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
    }

    function onPress(action: string) {
        if (!props.disabled) {
            sendAction(action);
        }
    }

    return (
        <>
            <RichTextToolbar style={[styles.toolbarContainer, props.toolbarStyle]} actionMap={props.actionMap} selectedActions={[]} onPress={onPress} />
            <View style={[styles.editorContainer, props.editorStyle, { height }]}>
                <WebView ref={webViewRef} source={htmlSource} style={styles.webView} scrollEnabled={false} hideKeyboardAccessoryView={true} keyboardDisplayRequiresUserAction={false} onMessage={onMessage} originWhitelist={['*']} dataDetectorTypes={'none'} bounces={false} onLoad={onLoad} onError={onError} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    editorContainer: {},
    toolbarContainer: {},
    webView: {
        margin: 10,
        backgroundColor: 'transparent',
    }
});
