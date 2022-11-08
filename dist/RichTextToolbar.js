import React, { forwardRef, useEffect, useId, useImperativeHandle, useState, } from 'react';
import { FlatList, Pressable, StyleSheet, View, } from 'react-native';
export var ActionKey;
(function (ActionKey) {
    ActionKey[ActionKey["undo"] = 0] = "undo";
    ActionKey[ActionKey["redo"] = 1] = "redo";
    ActionKey[ActionKey["bold"] = 2] = "bold";
    ActionKey[ActionKey["italic"] = 3] = "italic";
    ActionKey[ActionKey["underline"] = 4] = "underline";
    ActionKey[ActionKey["unorderedList"] = 5] = "unorderedList";
    ActionKey[ActionKey["orderedList"] = 6] = "orderedList";
    ActionKey[ActionKey["clear"] = 7] = "clear";
    ActionKey[ActionKey["code"] = 8] = "code";
})(ActionKey || (ActionKey = {}));
function RichTextToolbar(props, ref) {
    const id = useId();
    const [actions, setActions] = useState([]);
    const createActions = (actionKeys, selectedActionKeys) => {
        console.log(actionKeys, selectedActionKeys);
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
        click: (actionKey) => {
            props.onPress(actionKey);
        },
    }));
    useEffect(() => {
        const actionKeys = Object.keys(props.actionMap).map((key) => parseInt(key, 10));
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
    },
});
export default forwardRef(RichTextToolbar);
//# sourceMappingURL=RichTextToolbar.js.map