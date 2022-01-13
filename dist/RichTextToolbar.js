import React, { forwardRef, useEffect, useImperativeHandle, useState, } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, } from 'react-native';
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
    const getActions = (names, selectedActions) => {
        return names.map((name) => ({
            name,
            selected: selectedActions.includes(name),
        }));
    };
    const renderAction = (action) => {
        const icon = props.actionMap[action.name](action);
        return (<TouchableOpacity style={styles.touchableOpacity} activeOpacity={0.6} key={action.name} onPress={() => props.onPress(action.name)}>
                {icon}
            </TouchableOpacity>);
    };
    const keyExtractor = (action) => action.name;
    if (data.length === 0) {
        return null;
    }
    return (<View style={[styles.toolbarContainer, props.style]}>
            <FlatList horizontal={true} keyExtractor={keyExtractor} data={data} alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={false} renderItem={({ item }) => renderAction(item)}/>
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