import { Inter_500Medium } from '@expo-google-fonts/inter';
import { Oswald_400Regular } from '@expo-google-fonts/oswald';
import { RobotoCondensed_400Regular_Italic } from '@expo-google-fonts/roboto-condensed';
import { MaterialIcons } from '@expo/vector-icons';
import { RichTextEditor, RichTextViewer } from '@siposdani87/expo-rich-text-editor';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Oswald_400Regular,
    RobotoCondensed_400Regular_Italic,
  });

  let exampleNumber = null;
  // exampleNumber = 0;
  const [value, setValue] = useState<string>('');
  const numberOfLines = 5;
  const minHeight = 20 * numberOfLines;

  useEffect(() => {
    setTimeout(() => {
      let result = '';
      const v = '<p><i><u>Underline italic text</u></i> <b>bold word</b> normal text with some characters <i>Italic word</i> another normal text <u>underline word</u> and email link <a href="mailto:siposdani87@gmail.com">mailto</a> and standard link <a href="https://google.com" target="_blank"><b>link to website</b></a> and link to <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank">download file</a>.</p><p>New paragraph</p><p>This is a new <i>italic</i> paragraph</p><p>this is another new <u>underline</u> paragraph</p><ul><li>list item 1</li><li>list item 2</li></ul>';
      for (let i = 0; i <= 3; i++) {
        result += (i + '<br />') + v;
      }
      result += '<br />End';
      setValue(result);
    }, 2000);
  }, []);

  async function onValueChange(v: string) {
    console.log('onValueChange', v);
    setValue(v);
  }

  function getActionMap() {
    const size = 24;

    function getColor(selected: boolean) {
      return selected ? 'red' : 'black';
    }

    return {
      undo: ({ selected }) => (<MaterialIcons name='undo' size={size} color={getColor(selected)} />),
      redo: ({ selected }) => (<MaterialIcons name='redo' size={size} color={getColor(selected)} />),
      bold: ({ selected }) => (<MaterialIcons name='format-bold' size={size} color={getColor(selected)} />),
      italic: ({ selected }) => (<MaterialIcons name='format-italic' size={size} color={getColor(selected)} />),
      underline: ({ selected }) => (<MaterialIcons name='format-underlined' size={size} color={getColor(selected)} />),
      unorderedList: ({ selected }) => (<MaterialIcons name='format-list-bulleted' size={size} color={getColor(selected)} />),
      orderedList: ({ selected }) => (<MaterialIcons name='format-list-numbered' size={size} color={getColor(selected)} />),
      clear: ({ selected }) => (<MaterialIcons name='format-clear' size={size} color={getColor(selected)} />),
      code: ({ selected }) => (<MaterialIcons name='code' size={size} color={getColor(selected)} />),
    };
  }

  function onFocus() {
    console.log('onFocus');
  }

  function onBlur() {
    console.log('onBlur');
  }

  function isSelectedExample(index: number) {
    return index === exampleNumber || exampleNumber === null;
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.container}>
          <StatusBar style='dark' />
          <ScrollView>
            {isSelectedExample(0) && (<View style={[styles.editorContainer]}>
              <RichTextViewer html={value} editorStyle={styles.editorViewer} linkStyle={styles.linkStyle} debug={true} />
            </View>)}
            {isSelectedExample(1) && (<View style={[styles.editorContainer]}>
              <RichTextEditor minHeight={minHeight} value={value} selectionColor='red' actionMap={getActionMap()} onValueChange={onValueChange} onFocus={onFocus} onBlur={onBlur} toolbarStyle={styles.toolbar} editorStyle={styles.editor} debug={true} />
            </View>)}
            {isSelectedExample(2) && (<View style={[styles.editorContainer]}>
              <RichTextEditor minHeight={minHeight} value={value} actionMap={getActionMap()} onValueChange={onValueChange} toolbarStyle={styles.toolbar} editorStyle={styles.editorDark} debug={true} />
            </View>)}
            {isSelectedExample(3) && (<View style={[styles.editorContainer]}>
              <RichTextEditor minHeight={minHeight} value={value} actionMap={getActionMap()} onValueChange={onValueChange} toolbarStyle={styles.toolbar} editorStyle={styles.editor} disabled={true} debug={true} />
            </View>)}
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
  editorViewer: {
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
  linkStyle: {
    color: 'green',
  },
  toolbar: {
    borderColor: 'red',
    borderWidth: 1,
  },
});