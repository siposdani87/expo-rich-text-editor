import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { AppLoading } from 'expo';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Inter_500Medium } from '@expo-google-fonts/inter';
import { Oswald_400Regular } from '@expo-google-fonts/oswald';
import { RobotoCondensed_400Regular_Italic } from '@expo-google-fonts/roboto-condensed';
import { useFonts } from 'expo-font';

import RichTextEditor from './src/RichTextEditor';
import RichTextViewer from './src/RichTextViewer';

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_500Medium,
    Oswald_400Regular,
    RobotoCondensed_400Regular_Italic
  });

  const [value, setValue] = useState(null);
  const numberOfLines = 5;
  const minHeight = 20 * numberOfLines;

  useEffect(() => {
    setTimeout(() => {
      const v = '<p><i><u>Vadásztársaságunk</u></i> <b>2006</b>-ban alakult, a volt <i>Rábaközi Vadásztársaság</i> területeinek feldarabolása <b>következtében</b>.<br></p><p>Hello <b>bold</b> world!</p><p>this is a new <i>italic</i> paragraph</p> <p>this is another new <u>underline</u> paragraph</p>';
      setValue(v);
    }, 2000);
  }, []);

  async function onValueChange(v) {
    console.log('onValueChange', v);
    setValue(v);
  }

  function getActionMap() {
    const size = 24;

    function getColor(selected) {
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

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.container}>
          <StatusBar style='dark' />
          <ScrollView>
            <View style={[styles.editorContainer]}>
              <RichTextViewer html={value} editorStyle={styles.editorViewer} debug={true} />
            </View>
            <View style={[styles.editorContainer]}>
              <RichTextEditor minHeight={minHeight} value={value} actionMap={getActionMap()} onValueChange={onValueChange} toolbarStyle={styles.toolbar} editorStyle={styles.editor} debug={true} />
            </View>
            <View style={[styles.editorContainer]}>
              <RichTextEditor minHeight={minHeight} value={value} actionMap={getActionMap()} onValueChange={onValueChange} toolbarStyle={styles.toolbar} editorStyle={styles.editorDark} debug={true} />
            </View>
            <View style={[styles.editorContainer]}>
              <RichTextEditor minHeight={minHeight} value={value} actionMap={getActionMap()} onValueChange={onValueChange} toolbarStyle={styles.toolbar} editorStyle={styles.editor} disabled={true} debug={true} />
            </View>
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
  },
  editorDark: {
    borderColor: 'blue',
    borderWidth: 1,
    backgroundColor: 'black',
    color: 'white',
    padding: 15,
    fontFamily: 'RobotoCondensed_400Regular_Italic',
  },
  toolbar: {
    borderColor: 'red',
    borderWidth: 1,
  },
});
