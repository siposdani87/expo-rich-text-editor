import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import RichTextToolbar, { ActionKey, } from './RichTextToolbar';
import HTML from './editor';
import { useEditorActions, useEditorInitialization, useMessageHandler, useSelectedActionKeys, useSendAction, } from './hooks';
// let htmlSource = require('./editor.html');
// if (Platform.OS === 'android' || Platform.OS === 'web') {
const htmlSource = { html: HTML };
// }
export default function RichTextEditor(props) {
    const containerStyle = StyleSheet.flatten(props.containerStyle);
    const textStyle = StyleSheet.flatten(props.textStyle);
    const linkStyle = StyleSheet.flatten(props.linkStyle);
    const [inited, setInited] = useState(false);
    const [minHeight] = useState(props.minHeight ?? 40);
    const webViewRef = useRef(null);
    const toolbarRef = useRef(null);
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
    const postMessage = useCallback((message) => {
        webViewRef.current?.postMessage(message);
    }, [webViewRef]);
    const { sendAction } = useSendAction({ postMessage });
    const onMessage = ({ nativeEvent }) => {
        handleMessage(nativeEvent.data);
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
    return (<>
            {props.actionMap && (<RichTextToolbar ref={toolbarRef} style={props.toolbarStyle} actionMap={props.actionMap} selectedActionKeys={selectedActionKeys} onPress={onPress}/>)}
            <View style={[styles.editorContainer, containerStyle]}>
                <WebView ref={webViewRef} source={htmlSource} style={[styles.webView, { height }]} textZoom={100} scrollEnabled={false} hideKeyboardAccessoryView keyboardDisplayRequiresUserAction={false} onMessage={onMessage} originWhitelist={['*']} dataDetectorTypes={['none']} bounces={false} onLoad={onLoad} onError={onError}/>
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