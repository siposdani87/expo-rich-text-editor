import React, {
    forwardRef,
    useEffect,
    useId,
    useImperativeHandle,
    useState,
} from 'react';
import {
    FlatList,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

interface Action {
    key: string;
    selected: boolean;
}

type RendererActionElement = (_action: Action) => JSX.Element;

export interface ActionMap {
    [key: string]: RendererActionElement;
}

function RichTextToolbar(
    props: {
        actionMap: ActionMap;
        selectedActionKeys: string[];
        onPress: (_actionKey: string) => void;
        style?: StyleProp<ViewStyle>;
    },
    ref: any,
) {
    const id = useId();
    const [actions, setActions] = useState<Action[]>([]);

    const createActions = (
        actionKeys: string[],
        selectedActionKeys: string[],
    ): Action[] => {
        return actionKeys.map<Action>((key) => ({
            key,
            selected: selectedActionKeys.includes(key),
        }));
    };

    const renderAction = (action: Action): JSX.Element => {
        const iconElement = props.actionMap[action.key](action);

        return (
            <Pressable onPress={() => props.onPress(action.key)}>
                <View style={styles.actionContainer}>{iconElement}</View>
            </Pressable>
        );
    };

    const keyExtractor = (action: Action): string => `${id}-${action.key}`;

    useImperativeHandle(ref, () => ({
        click: (action: string) => {
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

    return (
        <View style={[styles.toolbarContainer, props.style]}>
            <FlatList
                horizontal={true}
                keyExtractor={keyExtractor}
                data={actions}
                alwaysBounceHorizontal={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => renderAction(item)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    toolbarContainer: {},
    actionContainer: {
        marginRight: 8,
        marginBottom: 2,
    },
});

export default forwardRef(RichTextToolbar);
