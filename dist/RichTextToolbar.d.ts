import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
interface Action {
    key: string;
    selected: boolean;
}
declare type RendererActionElement = (_action: Action) => JSX.Element;
export interface ActionMap {
    [key: string]: RendererActionElement;
}
declare const _default: React.ForwardRefExoticComponent<{
    actionMap: ActionMap;
    selectedActionKeys: string[];
    onPress: (_actionKey: string) => void;
    style?: StyleProp<ViewStyle>;
} & React.RefAttributes<unknown>>;
export default _default;
