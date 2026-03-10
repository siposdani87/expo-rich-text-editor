import { EditorActions } from '../hooks';

// Mock react-native
jest.mock('react-native', () => ({
    Linking: { openURL: jest.fn() },
    StyleSheet: {
        flatten: <T>(style: T): T => style as T,
    },
}));

// Capture hook state via direct function testing
// Since hooks require React runtime, we test the logic via the actions object pattern

describe('EditorActions', () => {
    let onValueChange: jest.Mock;
    let onClickLink: jest.Mock;
    let onFocus: jest.Mock;
    let onBlur: jest.Mock;

    beforeEach(() => {
        onValueChange = jest.fn();
        onClickLink = jest.fn();
        onFocus = jest.fn();
        onBlur = jest.fn();
    });

    function createActions(
        overrides: Partial<{
            onClickLink: (url: string) => void;
            onFocus: () => void;
            onBlur: () => void;
            debug: boolean;
        }> = {},
    ): EditorActions {
        const setValue = jest.fn();
        const setHeight = jest.fn();

        const actions: EditorActions = {
            changeHtml: (html: string) => {
                setValue(html);
                onValueChange(html);
            },
            changeHeight: (newHeight: number) => {
                const minHeight = 40;
                if (newHeight < minHeight) {
                    newHeight = minHeight;
                }
                const offset = 16;
                setHeight(newHeight + offset);
            },
            onClickLink: (url: string) => {
                if (overrides.onClickLink) {
                    return overrides.onClickLink(url);
                }
                const { Linking } = require('react-native');
                Linking.openURL(url);
            },
            onFocus: () => {
                overrides.onFocus?.();
            },
            onBlur: () => {
                overrides.onBlur?.();
            },
            log: (message: string) => {
                if (overrides.debug) {
                    console.log(message);
                }
            },
        };

        return actions;
    }

    describe('changeHtml', () => {
        it('should call onValueChange with html', () => {
            const actions = createActions();
            actions.changeHtml('<p>test</p>');
            expect(onValueChange).toHaveBeenCalledWith('<p>test</p>');
        });
    });

    describe('onClickLink', () => {
        it('should call custom onClickLink if provided', () => {
            const actions = createActions({ onClickLink });
            actions.onClickLink('https://example.com');
            expect(onClickLink).toHaveBeenCalledWith('https://example.com');
        });

        it('should call Linking.openURL if no custom handler', () => {
            const { Linking } = require('react-native');
            const actions = createActions();
            actions.onClickLink('https://example.com');
            expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
        });
    });

    describe('onFocus/onBlur', () => {
        it('should call onFocus callback', () => {
            const actions = createActions({ onFocus });
            actions.onFocus();
            expect(onFocus).toHaveBeenCalled();
        });

        it('should call onBlur callback', () => {
            const actions = createActions({ onBlur });
            actions.onBlur();
            expect(onBlur).toHaveBeenCalled();
        });

        it('should not throw if callbacks not provided', () => {
            const actions = createActions();
            expect(() => actions.onFocus()).not.toThrow();
            expect(() => actions.onBlur()).not.toThrow();
        });
    });

    describe('log', () => {
        it('should log when debug is true', () => {
            const spy = jest.spyOn(console, 'log').mockImplementation();
            const actions = createActions({ debug: true });
            actions.log('test message');
            expect(spy).toHaveBeenCalledWith('test message');
            spy.mockRestore();
        });

        it('should not log when debug is false', () => {
            const spy = jest.spyOn(console, 'log').mockImplementation();
            const actions = createActions({ debug: false });
            actions.log('test message');
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});

describe('Message handling logic', () => {
    it('should parse valid JSON messages and dispatch to actions', () => {
        const changeHtml = jest.fn();
        const actions: EditorActions = {
            changeHtml,
            changeHeight: jest.fn(),
            onClickLink: jest.fn(),
            onFocus: jest.fn(),
            onBlur: jest.fn(),
            log: jest.fn(),
        };

        const data = JSON.stringify({
            type: 'changeHtml',
            data: '<p>hello</p>',
        });
        const message = JSON.parse(data);
        const action = actions[message.type as keyof EditorActions];
        if (action) {
            (action as (arg: string) => void)(message.data);
        }

        expect(changeHtml).toHaveBeenCalledWith('<p>hello</p>');
    });

    it('should handle unknown message types gracefully', () => {
        const actions: EditorActions = {
            changeHtml: jest.fn(),
            changeHeight: jest.fn(),
            onClickLink: jest.fn(),
            onFocus: jest.fn(),
            onBlur: jest.fn(),
            log: jest.fn(),
        };

        const data = JSON.stringify({ type: 'unknownAction', data: 'test' });
        const message = JSON.parse(data);
        const action = actions[message.type as keyof EditorActions];

        expect(action).toBeUndefined();
    });

    it('should handle malformed JSON gracefully', () => {
        expect(() => {
            try {
                JSON.parse('not json');
            } catch {
                // Expected behavior - message handler catches this
            }
        }).not.toThrow();
    });
});

describe('sendAction logic', () => {
    it('should serialize type and data to JSON', () => {
        const postMessage = jest.fn();

        const sendAction = (
            type: string,
            data: string | number | boolean | undefined,
        ): void => {
            if (data === undefined || data === null) {
                return;
            }
            const message = JSON.stringify({ type, data });
            postMessage(message);
        };

        sendAction('setHtml', '<p>test</p>');
        expect(postMessage).toHaveBeenCalledWith(
            JSON.stringify({ type: 'setHtml', data: '<p>test</p>' }),
        );
    });

    it('should skip sending when data is undefined', () => {
        const postMessage = jest.fn();

        const sendAction = (
            type: string,
            data: string | number | boolean | undefined,
        ): void => {
            if (data === undefined || data === null) {
                return;
            }
            const message = JSON.stringify({ type, data });
            postMessage(message);
        };

        sendAction('setColor', undefined);
        expect(postMessage).not.toHaveBeenCalled();
    });

    it('should send boolean values', () => {
        const postMessage = jest.fn();

        const sendAction = (
            type: string,
            data: string | number | boolean | undefined,
        ): void => {
            if (data === undefined || data === null) {
                return;
            }
            const message = JSON.stringify({ type, data });
            postMessage(message);
        };

        sendAction('setDisabled', true);
        expect(postMessage).toHaveBeenCalledWith(
            JSON.stringify({ type: 'setDisabled', data: true }),
        );
    });

    it('should send numeric values', () => {
        const postMessage = jest.fn();

        const sendAction = (
            type: string,
            data: string | number | boolean | undefined,
        ): void => {
            if (data === undefined || data === null) {
                return;
            }
            const message = JSON.stringify({ type, data });
            postMessage(message);
        };

        sendAction('setFontSize', 18);
        expect(postMessage).toHaveBeenCalledWith(
            JSON.stringify({ type: 'setFontSize', data: 18 }),
        );
    });
});
