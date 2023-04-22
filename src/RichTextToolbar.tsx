import React, {
    ReactNode,
    forwardRef,
    useEffect,
    useId,
    useImperativeHandle,
    useState,
} from 'react';
import {
    FlatList,
    ListRenderItem,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

interface Action {
    key: ActionKey;
    selected: boolean;
}

type RendererActionElement = (_action: Action) => ReactNode;

export enum ActionKey {
    undo,
    redo,
    bold,
    italic,
    underline,
    unorderedList,
    orderedList,
    clear,
    code,
}

export type ActionMap = {
    [key in ActionKey]: RendererActionElement;
};

function RichTextToolbar(
    props: {
        actionMap: ActionMap;
        selectedActionKeys: ActionKey[];
        onPress: (_actionKey: ActionKey) => void;
        style?: StyleProp<ViewStyle>;
    },
    ref: any,
) {
    const id = useId();
    const [actions, setActions] = useState<Action[]>([]);

    const createActions = (
        actionKeys: ActionKey[],
        selectedActionKeys: ActionKey[],
    ): Action[] => {
        return actionKeys.map<Action>((key) => ({
            key,
            selected: selectedActionKeys.includes(key),
        }));
    };

    const renderAction = (action: Action) => {
        const iconElement = props.actionMap[action.key](action);

        return (
            <Pressable onPress={() => props.onPress(action.key)}>
                <View style={styles.actionContainer}>{iconElement}</View>
            </Pressable>
        );
    };

    const renderItem: ListRenderItem<Action> = ({ item }) => renderAction(item);

    const keyExtractor = (action: Action): string => `${id}-${action.key}`;

    useImperativeHandle(ref, () => ({
        click: (actionKey: ActionKey) => {
            props.onPress(actionKey);
        },
    }));

    useEffect(() => {
        const actionKeys = Object.keys(props.actionMap).map<ActionKey>((key) =>
            parseInt(key, 10),
        );
        setActions(createActions(actionKeys, props.selectedActionKeys));
    }, [props.actionMap, props.selectedActionKeys]);

    if (actions.length === 0) {
        return null;
    }

    return (
        <View style={[styles.toolbarContainer, props.style]}>
            <FlatList
                horizontal={true}
                keyExtractor={keyExtractor}
                data={actions}
                alwaysBounceHorizontal={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    toolbarContainer: {},
    actionContainer: {
        marginRight: 8,
    },
});

export default forwardRef(RichTextToolbar);
