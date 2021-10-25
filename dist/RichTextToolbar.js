import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
function RichTextToolbar(props, ref) {
    const [data, setData] = useState([]);
    useImperativeHandle(ref, () => ({
        click: (action) => {
            props.onPress(action);
        },
    }));
    useEffect(() => {
        const actions = Object.keys(props.actionMap || {});
        setData(getActions(actions, props.selectedActions));
    }, [props.actionMap, props.selectedActions]);
    function getActions(actions, selectedActions) {
        return actions.map((action) => {
            return {
                action,
                selected: selectedActions.includes(action),
            };
        });
    }
    function renderAction(action, selected) {
        const icon = props.actionMap[action]({ selected });
        return (<TouchableOpacity style={styles.touchableOpacity} activeOpacity={0.6} key={action} onPress={() => props.onPress(action)}>
        {icon}
      </TouchableOpacity>);
    }
    if (data.length > 0) {
        return (<View style={[styles.toolbarContainer, props.style]}>
        <FlatList horizontal={true} keyExtractor={(item) => item.action} data={data} alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={false} renderItem={({ item }) => renderAction(item.action, item.selected)}/>
      </View>);
    }
    return null;
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