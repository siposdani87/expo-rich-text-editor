import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import RichTextEditor from './src/RichTextEditor';

export default function App() {
  const [value, setValue] = useState(null);
  const numberOfLines = 5;
  const minHeight = 20 * numberOfLines;

  useEffect(() => {
    setTimeout(() => {
      const v = 'Hello <b>bold</b> world!<p>this is a new <i>italic</i> paragraph</p> <p>this is another new <u>underline</u> paragraph</p>';
      setValue(v);
    }, 2000);
  }, []);

  async function onValueChange(v) {
    console.log('onValueChange', v);
  }

  function getActionMap() {
    function getColor(selected) {
      return selected ? 'red' : 'black';
    }

    const size= 24;

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
    <View style={styles.container}>
      <StatusBar style='auto' />

      <View style={[styles.editorView]}>
        <RichTextEditor minHeight={minHeight} value={value} actionMap={getActionMap()} onValueChange={onValueChange} toolbarStyle={styles.toolbar} editorStyle={styles.editor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editorView: {
    width: '100%',
    backgroundColor: 'yellow',
  },
  editor: {
    borderColor: 'black',
    borderWidth: 1,
  },
  toolbar: {
    borderColor: 'red',
    borderWidth: 1,
  },
});
