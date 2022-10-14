import React, { forwardRef, useEffect, useId, useImperativeHandle, useState, } from 'react';
import { FlatList, Pressable, StyleSheet, View, } from 'react-native';
function RichTextToolbar(props, ref) {
    const id = useId();
    const [actions, setActions] = useState([]);
    useImperativeHandle(ref, () => ({
        click: (action) => {
            props.onPress(action);
        },
    }));
    useEffect(() => {
        const actionKeys = Object.keys(props.actionMap || {});
        setActions(createActions(actionKeys, props.selectedActionKeys));
    }, [props.actionMap, props.selectedActionKeys]);
    const createActions = (actionKeys, selectedActionKeys) => {
        return actionKeys.map((key) => ({
            key,
            selected: selectedActionKeys.includes(key),
        }));
    };
    const renderAction = (action) => {
        const icon = props.actionMap[action.key](action);
        return (<Pressable style={styles.touchableOpacity} onPress={() => props.onPress(action.key)}>
                {icon}
            </Pressable>);
    };
    const keyExtractor = (action) => `${id}-${action.key}`;
    if (actions.length === 0) {
        return null;
    }
    return (<View style={[styles.toolbarContainer, props.style]}>
            <FlatList horizontal={true} keyExtractor={keyExtractor} data={actions} alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={false} renderItem={({ item }) => renderAction(item)}/>
        </View>);
}
const styles = StyleSheet.create({
    toolbarContainer: {},
    touchableOpacity: {
        marginRight: 8,
        marginBottom: 2,
    },
});
export default forwardRef(RichTextToolbar);
//# sourceMappingURL=RichTextToolbar.js.map