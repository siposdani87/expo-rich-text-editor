import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import HTML from './editor';
import RichTextToolbar from './RichTextToolbar';
// let htmlSource = require('./editor.html');
// if (Platform.OS === 'android' || Platform.OS === 'web') {
const htmlSource = { html: HTML };
// }
export default function RichTextEditor(props) {
    const editorStyle = StyleSheet.flatten(props.editorStyle);
    const linkStyle = StyleSheet.flatten(props.linkStyle);
    const [value, setValue] = useState(props.value);
    const [inited, setInited] = useState(false);
    const [minHeight] = useState(props.minHeight || 40);
    const [height, setHeight] = useState(minHeight);
    const [selectedActions, setSelectedActions] = useState([]);
    const webViewRef = useRef(null);
    const toolbarRef = useRef(null);
    const Actions = {
        changeHtml: (html) => {
            setValue(html);
            props.onValueChange(html);
        },
        changeHeight: (h) => {
            if (h < minHeight) {
                h = minHeight;
            }
            const offset = editorStyle?.fontSize || 16;
            setHeight(h + offset);
        },
        clickLink: (url) => {
            Linking.openURL(url);
        },
        onFocus: (_) => {
            props.onFocus?.();
        },
        onBlur: (_) => {
            props.onBlur?.();
        },
        log: (message) => {
            if (props.debug) {
                console.log(message);
            }
        },
    };
    const sendAction = useCallback((type, data = null) => {
        if (data === undefined || data === null) {
            return;
        }
        const message = JSON.stringify({ type, data });
        webViewRef.current?.postMessage(message);
    }, [webViewRef]);
    useEffect(() => {
        setValue(props.value);
    }, [inited, props.value]);
    useEffect(() => {
        if (inited) {
            sendAction('setHtml', value);
        }
    }, [inited, value, sendAction]);
    useEffect(() => {
        if (inited) {
            sendAction('setColor', editorStyle?.color);
            sendAction('setFontFamily', editorStyle?.fontFamily);
            sendAction('setFontSize', editorStyle?.fontSize);
            sendAction('setLinkColor', linkStyle?.color);
            sendAction('setSelectionColor', props.selectionColor);
        }
    }, [inited, editorStyle, linkStyle, props.selectionColor, sendAction]);
    useEffect(() => {
        if (inited) {
            sendAction('setDisabled', !!props.disabled);
        }
    }, [inited, props.disabled, sendAction]);
    const onMessage = (event) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            const action = Actions[message?.type];
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
    };
    const onLoad = () => {
        setInited(true);
    };
    const onError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
    };
    const onPress = (action) => {
        if (!props.disabled) {
            handleSelectedActions(action);
            sendAction(action);
        }
    };
    const handleSelectedActions = (action) => {
        if (action === 'code') {
            const index = selectedActions.indexOf('code');
            if (index === -1) {
                setSelectedActions(['code']);
            }
            else {
                setSelectedActions([]);
            }
        }
    };
    return (<>
            {props.actionMap && (<RichTextToolbar ref={toolbarRef} style={[styles.toolbarContainer, props.toolbarStyle]} actionMap={props.actionMap} selectedActions={selectedActions} onPress={onPress}/>)}
            <View style={[styles.editorContainer, editorStyle]}>
                <WebView ref={webViewRef} source={htmlSource} style={[styles.webView, { height }]} textZoom={100} scrollEnabled={false} hideKeyboardAccessoryView={true} keyboardDisplayRequiresUserAction={false} onMessage={onMessage} originWhitelist={['*']} dataDetectorTypes={'none'} bounces={false} onLoad={onLoad} onError={onError}/>
            </View>
        </>);
}
const styles = StyleSheet.create({
    editorContainer: {
        flex: 1,
    },
    toolbarContainer: {},
    webView: {
        flex: 0,
        backgroundColor: 'transparent',
    },
});
//# sourceMappingURL=RichTextEditor.js.map