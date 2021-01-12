import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function RichTextToolbar(props: { actionMap: any, selectedActions: string[], onPress: (_action: string) => void, style?: any }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const actions = Object.keys(props.actionMap || {});
    setData(getActions(actions, props.selectedActions));
  }, [props.actionMap, props.selectedActions]);

  function getActions(actions: string[], selectedActions: string[]) {
    return actions.map((action) => {
      return {
        action,
        selected: selectedActions.includes(action),
      };
    });
  }

  function renderAction(action: string, selected: boolean) {
    const icon = props.actionMap[action]({ selected });
    return (
      <TouchableOpacity style={styles.touchableOpacity} activeOpacity={0.6} key={action} onPress={() => props.onPress(action)}>
        {icon}
      </TouchableOpacity>
    );
  }

  if (data.length > 0) {
    return (
      <View style={[styles.toolbarContainer, props.style]}>
        <FlatList horizontal={true} keyExtractor={(item) => item.action} data={data} alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={false} renderItem={({ item }) => renderAction(item.action, item.selected)} />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  toolbarContainer: {},
  touchableOpacity: {
    marginRight: 8,
    marginBottom: 2,
  },
});
