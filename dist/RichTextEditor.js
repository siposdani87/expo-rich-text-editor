import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, View, } from 'react-native';
import { WebView } from 'react-native-webview';
import HTML from './editor';
import RichTextToolbar, { ActionKey } from './RichTextToolbar';
// let htmlSource = require('./editor.html');
// if (Platform.OS === 'android' || Platform.OS === 'web') {
const htmlSource = { html: HTML };
// }
export default function RichTextEditor(props) {
    const containerStyle = StyleSheet.flatten(props.containerStyle);
    const textStyle = StyleSheet.flatten(props.textStyle);
    const linkStyle = StyleSheet.flatten(props.linkStyle);
    const [value, setValue] = useState(props.value);
    const [inited, setInited] = useState(false);
    const [minHeight] = useState(props.minHeight ?? 40);
    const [height, setHeight] = useState(minHeight);
    const [selectedActionKeys, setSelectedActionKeys] = useState([]);
    const webViewRef = useRef(null);
    const toolbarRef = useRef(null);
    const Actions = {
        changeHtml: (html) => {
            setValue(html);
            props.onValueChange(html);
        },
        changeHeight: (newHeight) => {
            if (newHeight < minHeight) {
                newHeight = minHeight;
            }
            const offset = textStyle?.fontSize ?? 16;
            setHeight(newHeight + offset);
        },
        onClickLink: (url) => {
            if (props.onClickLink) {
                return props.onClickLink(url);
            }
            Linking.openURL(url);
        },
        onFocus: () => {
            props.onFocus?.();
        },
        onBlur: () => {
            props.onBlur?.();
        },
        log: (message) => {
            if (props.debug) {
                console.log(message);
            }
        },
    };
    const sendAction = useCallback((type, data) => {
        if (data === undefined || data === null) {
            return;
        }
        const message = JSON.stringify({ type, data });
        webViewRef.current?.postMessage(message);
    }, [webViewRef]);
    const onMessage = ({ nativeEvent }) => {
        try {
            const message = JSON.parse(nativeEvent.data);
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
    const onError = ({ nativeEvent }) => {
        console.warn('WebView error: ', nativeEvent);
    };
    const onPress = (actionKey) => {
        if (!props.disabled) {
            handleSelectedActionKeys(actionKey);
            sendAction(ActionKey[actionKey], '');
        }
    };
    const handleSelectedActionKeys = (actionKey) => {
        if (actionKey === ActionKey.code) {
            const contains = selectedActionKeys.includes(ActionKey.code);
            const actionKeys = contains ? [] : [ActionKey.code];
            setSelectedActionKeys(actionKeys);
        }
    };
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
            sendAction('setColor', textStyle?.color);
            sendAction('setFontFamily', textStyle?.fontFamily);
            sendAction('setFontSize', textStyle?.fontSize);
            sendAction('setLinkColor', linkStyle?.color);
            sendAction('setSelectionColor', props.selectionColor);
        }
    }, [inited, textStyle, linkStyle, props.selectionColor, sendAction]);
    useEffect(() => {
        if (inited) {
            sendAction('setDisabled', !!props.disabled);
        }
    }, [inited, props.disabled, sendAction]);
    useEffect(() => {
        if (inited) {
            sendAction('setAutoFocus', !!props.autoFocus);
        }
    }, [inited, props.autoFocus, sendAction]);
    return (<>
            {props.actionMap && (<RichTextToolbar ref={toolbarRef} style={props.toolbarStyle} actionMap={props.actionMap} selectedActionKeys={selectedActionKeys} onPress={onPress}/>)}
            <View style={[styles.editorContainer, containerStyle]}>
                <WebView ref={webViewRef} source={htmlSource} style={[styles.webView, { height }]} textZoom={100} scrollEnabled={false} hideKeyboardAccessoryView={true} keyboardDisplayRequiresUserAction={false} onMessage={onMessage} originWhitelist={['*']} dataDetectorTypes={'none'} bounces={false} onLoad={onLoad} onError={onError}/>
            </View>
        </>);
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
//# sourceMappingURL=RichTextEditor.js.map