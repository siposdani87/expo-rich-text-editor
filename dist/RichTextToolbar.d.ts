import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
interface Action {
    key: ActionKey;
    selected: boolean;
}
type RendererActionElement = (_action: Action) => ReactNode;
export declare enum ActionKey {
    undo = 0,
    redo = 1,
    bold = 2,
    italic = 3,
    underline = 4,
    unorderedList = 5,
    orderedList = 6,
    clear = 7,
    code = 8
}
export type ActionMap = {
    [key in ActionKey]: RendererActionElement;
};
export interface RichTextToolbarHandle {
    click: (actionKey: ActionKey) => void;
}
declare const _default: React.ForwardRefExoticComponent<{
    actionMap: ActionMap;
    selectedActionKeys: ActionKey[];
    onPress: (_actionKey: ActionKey) => void;
    style?: StyleProp<ViewStyle>;
} & React.RefAttributes<RichTextToolbarHandle>>;
export default _default;
//# sourceMappingURL=RichTextToolbar.d.ts.map