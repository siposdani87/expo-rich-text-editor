import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, Platform } from 'react-native';
import RichTextToolbar from './RichTextToolbar';
import { HTML } from './editor';

let htmlSource = require('./editor.html');
if (Platform.OS === 'android'){
    htmlSource = { html: HTML };
}

export default function RichTextEditor(props: { value: string, actionMap: {}, minHeight: number, onValueChange: (v) => void, editorStyle?: any, toolbarStyle?: any, disabled?: boolean }) {
    const webViewRef = useRef(null);
    const [inited, setInited] = useState(false);
    const [height, setHeight] = useState(props.minHeight);

    const Actions = {
        changeHtml: function (html) {
            props.onValueChange(html);
        },
        changeHeight: function(h){
            setHeight(h + 35);
        },
        log: function (message) {
            console.log(message);
        }
    };

    useEffect(() => {
        if (inited) {
            setHTML(props.value);
        }
    }, [inited, props.value]);

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

    function sendAction(type, data = null) {
        let message = JSON.stringify({ type, data });
        if (webViewRef.current) {
            webViewRef.current.postMessage(message);
        }
    }

    function setHTML(value) {
        sendAction('setHtml', value);
    }

    function onLoad() {
        setInited(true);
        setHTML(props.value);
    }

    function onError(syntheticEvent) {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
    }

    function onPress(action) {
        sendAction(action);
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
    editorContainer: {
        padding: 10,
    },
    toolbarContainer: {
    },
    webView: {
        flex: 1,
        height: '100%'
    }
});
