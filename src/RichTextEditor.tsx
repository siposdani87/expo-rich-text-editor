import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Linking,
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
    WebViewErrorEvent,
    WebViewMessageEvent,
} from 'react-native-webview/lib/WebViewTypes';
import HTML from './editor';
import RichTextToolbar, { ActionKey, ActionMap } from './RichTextToolbar';

// let htmlSource = require('./editor.html');
// if (Platform.OS === 'android' || Platform.OS === 'web') {
const htmlSource = { html: HTML };
// }

export default function RichTextEditor(props: {
    value: string;
    onValueChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onClickLink?: (url: string) => void;
    selectionColor?: string;
    actionMap?: ActionMap;
    minHeight?: number;
    linkStyle?: StyleProp<TextStyle>;
    textStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    toolbarStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    autoFocus?: boolean;
    debug?: boolean;
}) {
    const containerStyle = StyleSheet.flatten<ViewStyle>(props.containerStyle);
    const textStyle = StyleSheet.flatten<TextStyle>(props.textStyle);
    const linkStyle = StyleSheet.flatten<TextStyle>(props.linkStyle);
    const [value, setValue] = useState<string>(props.value);
    const [inited, setInited] = useState<boolean>(false);
    const [minHeight] = useState<number>(props.minHeight ?? 40);
    const [height, setHeight] = useState<number>(minHeight);
    const [selectedActionKeys, setSelectedActionKeys] = useState<ActionKey[]>(
        [],
    );
    const webViewRef = useRef<any>(null);
    const toolbarRef = useRef<any>(null);

    const Actions = {
        changeHtml: (html: string) => {
            setValue(html);
            props.onValueChange(html);
        },
        changeHeight: (newHeight: number) => {
            if (newHeight < minHeight) {
                newHeight = minHeight;
            }
            const offset = textStyle?.fontSize ?? 16;
            setHeight(newHeight + offset);
        },
        onClickLink: (url: string) => {
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
        log: (message: string) => {
            if (props.debug) {
                console.log(message);
            }
        },
    };

    const sendAction = useCallback(
        (type: string, data: any): void => {
            if (data === undefined || data === null) {
                return;
            }

            const message = JSON.stringify({ type, data });
            webViewRef.current?.postMessage(message);
        },
        [webViewRef],
    );

    const onMessage = ({ nativeEvent }: WebViewMessageEvent): void => {
        try {
            const message = JSON.parse(nativeEvent.data);
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

    const handleSelectedActionKeys = (actionKey: ActionKey): void => {
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
    webView: {
        flex: 0,
        backgroundColor: 'transparent',
    },
});
