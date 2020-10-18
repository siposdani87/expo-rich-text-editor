import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import RichTextEditor from './src/RichTextEditor';

export default function App() {
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

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.container}>
          <StatusBar style='auto' />
          <ScrollView>
            <View style={[styles.editorView]}>
              <RichTextEditor minHeight={minHeight} value={value} actionMap={getActionMap()} onValueChange={onValueChange} toolbarStyle={styles.toolbar} editorStyle={styles.editor} />
            </View>
            <View style={[styles.editorView]}>
              <RichTextEditor minHeight={minHeight} value={value} actionMap={getActionMap()} onValueChange={onValueChange} toolbarStyle={styles.toolbar} editorStyle={styles.editor} />
            </View>
            <View style={[styles.editorView]}>
              <RichTextEditor minHeight={minHeight} value={value} actionMap={getActionMap()} onValueChange={onValueChange} toolbarStyle={styles.toolbar} editorStyle={styles.editor} />
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
  editorView: {
    margin: 10,
  },
  editor: {
    borderColor: 'blue',
    borderWidth: 1,
  },
  toolbar: {
    borderColor: 'red',
    borderWidth: 1,
  },
});
