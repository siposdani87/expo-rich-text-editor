import { Inter_500Medium } from '@expo-google-fonts/inter';
import { Oswald_400Regular } from '@expo-google-fonts/oswald';
import { RobotoCondensed_400Regular_Italic } from '@expo-google-fonts/roboto-condensed';
import { MaterialIcons } from '@expo/vector-icons';
import {
    RichTextEditor,
    RichTextViewer,
    ActionMap,
    ActionKey,
} from '@siposdani87/expo-rich-text-editor';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
    const [fontsLoaded] = useFonts({
        Inter_500Medium,
        Oswald_400Regular,
        RobotoCondensed_400Regular_Italic,
    });

    const exampleNumber = null;
    const [value, setValue] = useState<string>('');
    const numberOfLines = 5;
    const minHeight = 20 * numberOfLines;

    useEffect(()=> {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        const timer = setTimeout(() => {
            let result = '';
            const v =
                '<p><i><u>Underline italic text</u></i> <b>bold word</b> normal text with some characters <i>Italic word</i> another normal text <u>underline word</u> and email link <a href="mailto:siposdani87@gmail.com">mailto</a> and standard link <a href="https://google.com" target="_blank"><b>link to website</b></a> and link to <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank">download file</a>.</p><p>New paragraph</p><p>This is a new <i>italic</i> paragraph</p><p>this is another new <u>underline</u> paragraph</p><ul><li>list item 1</li><li>list item 2</li></ul>';
            for (let i = 0; i <= 3; i++) {
                result += i + '<br />' + v;
            }
            result += '<br />End';
            setValue(result);
        }, 2000);

        return () => {
            clearTimeout(timer);
          };
    }, []);

    const onValueChange = (v: string): void => {
        console.log('onValueChange', v);
        setValue(v);
    };

    const getColor = (selected: boolean): string => {
      return selected ? 'red' : 'black';
    };

    const getActionMap = (): ActionMap => {
        const size = 24;

        return {
            [ActionKey.undo]: ({ selected }) => (
                <MaterialIcons
                    name="undo"
                    size={size}
                    color={getColor(selected)}
                />
            ),
            [ActionKey.redo]: ({ selected }) => (
                <MaterialIcons
                    name="redo"
                    size={size}
                    color={getColor(selected)}
                />
            ),
            [ActionKey.bold]: ({ selected }) => (
                <MaterialIcons
                    name="format-bold"
                    size={size}
                    color={getColor(selected)}
                />
            ),
            [ActionKey.italic]: ({ selected }) => (
                <MaterialIcons
                    name="format-italic"
                    size={size}
                    color={getColor(selected)}
                />
            ),
            [ActionKey.underline]: ({ selected }) => (
                <MaterialIcons
                    name="format-underlined"
                    size={size}
                    color={getColor(selected)}
                />
            ),
            [ActionKey.unorderedList]: ({ selected }) => (
                <MaterialIcons
                    name="format-list-bulleted"
                    size={size}
                    color={getColor(selected)}
                />
            ),
            [ActionKey.orderedList]: ({ selected }) => (
                <MaterialIcons
                    name="format-list-numbered"
                    size={size}
                    color={getColor(selected)}
                />
            ),
            [ActionKey.clear]: ({ selected }) => (
                <MaterialIcons
                    name="format-clear"
                    size={size}
                    color={getColor(selected)}
                />
            ),
            [ActionKey.code]: ({ selected }) => (
                <MaterialIcons
                    name="code"
                    size={size}
                    color={getColor(selected)}
                />
            ),
        };
    };

    const onFocus = (): void => {
        console.log('onFocus');
    };

    const onBlur = (): void => {
        console.log('onBlur');
    };

    const isSelectedExample = (index: number): boolean => {
        return index === exampleNumber || exampleNumber === null;
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <View style={styles.container}>
                    <StatusBar style="dark" />
                    <ScrollView>
                        {isSelectedExample(0) && (
                            <View style={[styles.editorContainer]}>
                                <RichTextViewer
                                    value={value}
                                    viewerStyle={styles.viewer}
                                    linkStyle={styles.link}
                                    debug={true}
                                />
                            </View>
                        )}
                        {isSelectedExample(1) && (
                            <View style={[styles.editorContainer]}>
                                <RichTextEditor
                                    minHeight={minHeight}
                                    value={value}
                                    selectionColor="red"
                                    actionMap={getActionMap()}
                                    onValueChange={onValueChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    toolbarStyle={styles.toolbar}
                                    editorStyle={styles.editor}
                                    debug={true}
                                />
                            </View>
                        )}
                        {isSelectedExample(2) && (
                            <View style={[styles.editorContainer]}>
                                <RichTextEditor
                                    minHeight={minHeight}
                                    value={value}
                                    actionMap={getActionMap()}
                                    onValueChange={onValueChange}
                                    toolbarStyle={styles.toolbar}
                                    editorStyle={styles.editorDark}
                                    debug={true}
                                />
                            </View>
                        )}
                        {isSelectedExample(3) && (
                            <View style={[styles.editorContainer]}>
                                <RichTextEditor
                                    minHeight={minHeight}
                                    value={value}
                                    actionMap={getActionMap()}
                                    onValueChange={onValueChange}
                                    toolbarStyle={styles.toolbar}
                                    editorStyle={styles.editor}
                                    disabled={true}
                                    debug={true}
                                />
                            </View>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightgrey',
    },
    editorContainer: {
        margin: 10,
    },
    viewer: {
        borderColor: 'green',
        borderWidth: 1,
        padding: 5,
        fontFamily: 'Oswald_400Regular',
    },
    editor: {
        borderColor: 'blue',
        borderWidth: 1,
        padding: 5,
        fontFamily: 'Inter_500Medium',
        fontSize: 18,
    },
    editorDark: {
        borderColor: 'blue',
        borderWidth: 1,
        backgroundColor: 'black',
        color: 'white',
        padding: 15,
        fontFamily: 'RobotoCondensed_400Regular_Italic',
        fontSize: 12,
    },
    link: {
        color: 'green',
    },
    toolbar: {
        borderColor: 'red',
        borderWidth: 1,
    },
});
