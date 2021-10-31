import React from 'react';
interface Action {
    name: string;
    selected: boolean;
}
declare type RendererActionElement = (_action: Action) => JSX.Element;
export interface ActionMap {
    [key: string]: RendererActionElement;
}
declare const _default: React.ForwardRefExoticComponent<{
    actionMap: ActionMap;
    selectedActions: string[];
    onPress: (_actionName: string) => void;
    style?: any;
} & React.RefAttributes<unknown>>;
export default _default;
