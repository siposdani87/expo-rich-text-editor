import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import {
    FlatList,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface Action {
    name: string;
    selected: boolean;
}

type RendererActionElement = (_action: Action) => JSX.Element;

export interface ActionMap {
    [key: string]: RendererActionElement;
}

function RichTextToolbar(
    props: {
        actionMap: ActionMap;
        selectedActions: string[];
        onPress: (_actionName: string) => void;
        style?: StyleProp<ViewStyle>;
    },
    ref: any,
) {
    const [data, setData] = useState<Action[]>([]);

    useImperativeHandle(ref, () => ({
        click: (action: string) => {
            props.onPress(action);
        },
    }));

    useEffect(() => {
        const actions = Object.keys(props.actionMap || {});
        setData(getActions(actions, props.selectedActions));
    }, [props.actionMap, props.selectedActions]);

    const getActions = (
        names: string[],
        selectedActions: string[],
    ): Action[] => {
        return names.map<Action>((name) => ({
            name,
            selected: selectedActions.includes(name),
        }));
    };

    const renderAction = (action: Action): JSX.Element => {
        const icon = props.actionMap[action.name](action);
        return (
            <TouchableOpacity
                style={styles.touchableOpacity}
                activeOpacity={0.6}
                key={action.name}
                onPress={() => props.onPress(action.name)}
            >
                {icon}
            </TouchableOpacity>
        );
    };

    const keyExtractor = (action: Action): string => action.name;

    if (data.length === 0) {
        return null;
    }

    return (
        <View style={[styles.toolbarContainer, props.style]}>
            <FlatList
                horizontal={true}
                keyExtractor={keyExtractor}
                data={data}
                alwaysBounceHorizontal={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => renderAction(item)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    toolbarContainer: {},
    touchableOpacity: {
        marginRight: 8,
        marginBottom: 2,
    },
});

export default forwardRef(RichTextToolbar);
