import React, { forwardRef, useEffect, useId, useImperativeHandle, useState, } from 'react';
import { FlatList, Pressable, StyleSheet, View, } from 'react-native';
function RichTextToolbar(props, ref) {
    const id = useId();
    const [actions, setActions] = useState([]);
    const createActions = (actionKeys, selectedActionKeys) => {
        return actionKeys.map((key) => ({
            key,
            selected: selectedActionKeys.includes(key),
        }));
    };
    const renderAction = (action) => {
        const iconElement = props.actionMap[action.key](action);
        return (<Pressable onPress={() => props.onPress(action.key)}>
                <View style={styles.actionContainer}>{iconElement}</View>
            </Pressable>);
    };
    const keyExtractor = (action) => `${id}-${action.key}`;
    useImperativeHandle(ref, () => ({
        click: (action) => {
            props.onPress(action);
        },
    }));
    useEffect(() => {
        const actionKeys = Object.keys(props.actionMap || {});
        setActions(createActions(actionKeys, props.selectedActionKeys));
    }, [props.actionMap, props.selectedActionKeys]);
    if (actions.length === 0) {
        return null;
    }
    return (<View style={[styles.toolbarContainer, props.style]}>
            <FlatList horizontal={true} keyExtractor={keyExtractor} data={actions} alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={false} renderItem={({ item }) => renderAction(item)}/>
        </View>);
}
const styles = StyleSheet.create({
    toolbarContainer: {},
    actionContainer: {
        marginRight: 8,
        marginBottom: 2,
    },
});
export default forwardRef(RichTextToolbar);
//# sourceMappingURL=RichTextToolbar.js.map