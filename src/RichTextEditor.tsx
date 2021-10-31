import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import HTML from './editor';
import RichTextToolbar, { ActionMap } from './RichTextToolbar';

// let htmlSource = require('./editor.html');
// if (Platform.OS === 'android' || Platform.OS === 'web') {
const htmlSource = { html: HTML };
// }

export default function RichTextEditor(props: {
    value: string;
    onValueChange: (_value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    selectionColor?: string;
    actionMap?: ActionMap;
    minHeight?: number;
    linkStyle?: any;
    editorStyle?: any;
    toolbarStyle?: any;
    disabled?: boolean;
    debug?: boolean;
}) {
    const editorStyle = StyleSheet.flatten(props.editorStyle);
    const linkStyle = StyleSheet.flatten(props.linkStyle);
    const [value, setValue] = useState(props.value);
    const [inited, setInited] = useState(false);
    const [minHeight] = useState(props.minHeight || 40);
    const [height, setHeight] = useState(minHeight);
    const [selectedActions, setSelectedActions] = useState<string[]>([]);
    const webViewRef = useRef<any>(null);
    const toolbarRef = useRef<any>(null);

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
        onFocus: (_: string) => {
            props.onFocus?.();
        },
        onBlur: (_: string) => {
            props.onBlur?.();
        },
        log: (message: string) => {
            if (props.debug) {
                console.log(message);
            }
        },
    };

    const sendAction = useCallback(
        (type: string, data: any = null) => {
            if (data === undefined || data === null) {
                return;
            }

            const message = JSON.stringify({ type, data });
            webViewRef.current?.postMessage(message);
        },
        [webViewRef],
    );

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

    const onMessage = (event: any) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            const action = Actions[message?.type as keyof typeof Actions] as (
                _arg: any,
            ) => void;
            if (action) {
                action(message.data);
            } else {
                console.warn(`Missing Actions.${message.type} method`);
            }
        } catch (e) {
            console.error('onMessage: ', e);
        }
    };

    const onLoad = () => {
        setInited(true);
    };

    const onError = (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
    };

    const onPress = (action: string) => {
        if (!props.disabled) {
            handleSelectedActions(action);
            sendAction(action);
        }
    };

    const handleSelectedActions = (action: string) => {
        if (action === 'code') {
            const index = selectedActions.indexOf('code');
            if (index === -1) {
                setSelectedActions(['code']);
            } else {
                setSelectedActions([]);
            }
        }
    };

    return (
        <>
            {props.actionMap && (
                <RichTextToolbar
                    ref={toolbarRef}
                    style={[styles.toolbarContainer, props.toolbarStyle]}
                    actionMap={props.actionMap}
                    selectedActions={selectedActions}
                    onPress={onPress}
                />
            )}
            <View style={[styles.editorContainer, editorStyle]}>
                <WebView
                    ref={webViewRef}
                    source={htmlSource}
                    style={[styles.webView, { height }]}
                    textZoom={100}
                    scrollEnabled={false}
                    hideKeyboardAccessoryView={true}
                    keyboardDisplayRequiresUserAction={false}
                    onMessage={onMessage}
                    originWhitelist={['*']}
                    dataDetectorTypes={'none'}
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
    toolbarContainer: {},
    webView: {
        flex: 0,
        backgroundColor: 'transparent',
    },
});
