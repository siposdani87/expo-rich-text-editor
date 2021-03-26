import React, { Fragment, useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, Platform, Linking } from 'react-native';
import RichTextToolbar from './RichTextToolbar';

import { HTML } from './editor';
let htmlSource = require('./editor.html');
if (Platform.OS === 'android' || Platform.OS === 'web') {
    htmlSource = { html: HTML };
}

export default function RichTextEditor(props: { value: string, onValueChange: (_value: string) => void, onFocus?: () => void, onBlur?: () => void, selectionColor?: string, actionMap?: any, minHeight?: number, linkStyle?: any, editorStyle?: any, toolbarStyle?: any, disabled?: boolean, debug?: boolean }) {
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
        changeHtml: (html: string) => {
            setValue(html);
            props.onValueChange(html);
        },
        changeHeight: (h: number) => {
            if (h < minHeight) {
                h = minHeight;
            }
            const offset = editorStyle?.fontSize || 16;
            setHeight(h + offset);
        },
        clickLink: (url: string) => {
            Linking.openURL(url);
        },
        onFocus: () => {
            props.onFocus?.();
        },
        onBlur: () => {
            props.onBlur?.();
        },
        log: (message: string) => {
            if (props.debug) {
                console.log(message);
            }
        },
    };

    useEffect(() => {
        setValue(props.value);
    }, [inited, props.value]);

    useEffect(() => {
        if (inited) {
            setHTML(value);
        }
    }, [inited, value]);

    useEffect(() => {
        if (inited) {
            setColor(editorStyle?.color);
            setFontFamily(editorStyle?.fontFamily);
            setFontSize(editorStyle?.fontSize);
            setLinkColor(linkStyle?.color);
            setSelectionColor(props.selectionColor);
        }
    }, [inited, editorStyle]);

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
                console.warn(`Missing Actions.${message.type} method`);
            }
        } catch (e) {
            console.error('onMessage: ', e);
        }
    }

    function sendAction(type: string, data: any = null) {
        const message = JSON.stringify({ type, data });
        webViewRef.current?.postMessage(message);
    }

    function setHTML(html: string) {
        sendAction('setHtml', html);
    }

    function setColor(color: string) {
        if (color) {
            sendAction('setColor', color);
        }
    }

    function setFontSize(fontSize: number) {
        if (fontSize) {
            sendAction('setFontSize', fontSize);
        }
    }

    function setFontFamily(fontFamily: string) {
        if (fontFamily) {
            sendAction('setFontFamily', fontFamily);
        }
    }

    function setLinkColor(color: string) {
        if (color) {
            sendAction('setLinkColor', color);
        }
    }

    function setSelectionColor(color: string) {
        if (color) {
            sendAction('setSelectionColor', color);
        }
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
            handleSelectedActions(action);
            sendAction(action);
        }
    }

    function handleSelectedActions(action: string) {
        if (action === 'code'){
            const index = selectedActions.indexOf('code');
            if (index === -1){
                setSelectedActions(['code']);
            } else {
                setSelectedActions([]);
            }
        }
    }

    return (
        <Fragment>
            <RichTextToolbar ref={toolbarRef} style={[styles.toolbarContainer, props.toolbarStyle]} actionMap={props.actionMap} selectedActions={selectedActions} onPress={onPress} />
            <View style={[styles.editorContainer, editorStyle]}>
                <WebView ref={webViewRef} source={htmlSource} style={[styles.webView, { height }]} textZoom={100} scrollEnabled={false} hideKeyboardAccessoryView={true} keyboardDisplayRequiresUserAction={false} onMessage={onMessage} originWhitelist={['*']} dataDetectorTypes={'none'} bounces={false} onLoad={onLoad} onError={onError} />
            </View>
        </Fragment>
    );
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
