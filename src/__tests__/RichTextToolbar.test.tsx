import React from 'react';

// Mock react-native before importing component
jest.mock('react-native', () => {
    const React = require('react');
    const View = (props: Record<string, unknown>) =>
        React.createElement('View', props);
    const Text = (props: Record<string, unknown>) =>
        React.createElement('Text', props);
    const Pressable = (props: Record<string, unknown>) =>
        React.createElement('Pressable', props);
    const FlatList = (props: {
        data: Array<{ key: number; selected: boolean }>;
        renderItem: (info: {
            item: { key: number; selected: boolean };
        }) => React.ReactNode;
        keyExtractor: (item: { key: number; selected: boolean }) => string;
        [key: string]: unknown;
    }) => {
        const items = (props.data || []).map(
            (item: { key: number; selected: boolean }) =>
                React.createElement(
                    'FlatListItem',
                    { key: props.keyExtractor(item) },
                    props.renderItem({ item }),
                ),
        );
        return React.createElement('FlatList', null, ...items);
    };
    return {
        View,
        Text,
        Pressable,
        FlatList,
        StyleSheet: {
            create: <T extends Record<string, unknown>>(styles: T): T => styles,
        },
    };
});

import renderer, { act } from 'react-test-renderer';

import RichTextToolbar, { ActionKey, ActionMap } from '../RichTextToolbar';

const { Text } = require('react-native');

const makeAction = (label: string) => {
    return ({ selected }: { selected: boolean }) =>
        React.createElement(
            Text,
            null,
            selected ? `[${label}*]` : `[${label}]`,
        );
};

const createActionMap = (): ActionMap => ({
    [ActionKey.undo]: makeAction('undo'),
    [ActionKey.redo]: makeAction('redo'),
    [ActionKey.bold]: makeAction('B'),
    [ActionKey.italic]: makeAction('I'),
    [ActionKey.underline]: makeAction('U'),
    [ActionKey.unorderedList]: makeAction('UL'),
    [ActionKey.orderedList]: makeAction('OL'),
    [ActionKey.clear]: makeAction('X'),
    [ActionKey.code]: makeAction('<>'),
});

describe('RichTextToolbar', () => {
    it('should render toolbar with actions', async () => {
        const onPress = jest.fn();

        let tree: renderer.ReactTestRenderer;
        await act(async () => {
            tree = renderer.create(
                <RichTextToolbar
                    actionMap={createActionMap()}
                    selectedActionKeys={[]}
                    onPress={onPress}
                />,
            );
        });

        expect(tree!.toJSON()).toMatchSnapshot();
    });

    it('should render with selected action keys', async () => {
        const onPress = jest.fn();

        let tree: renderer.ReactTestRenderer;
        await act(async () => {
            tree = renderer.create(
                <RichTextToolbar
                    actionMap={createActionMap()}
                    selectedActionKeys={[ActionKey.bold]}
                    onPress={onPress}
                />,
            );
        });

        expect(tree!.toJSON()).toMatchSnapshot();
    });

    it('should apply custom style', async () => {
        const onPress = jest.fn();
        const customStyle = { backgroundColor: 'red', padding: 10 };

        let tree: renderer.ReactTestRenderer;
        await act(async () => {
            tree = renderer.create(
                <RichTextToolbar
                    actionMap={createActionMap()}
                    selectedActionKeys={[]}
                    onPress={onPress}
                    style={customStyle}
                />,
            );
        });

        expect(tree!.toJSON()).toMatchSnapshot();
    });
});
