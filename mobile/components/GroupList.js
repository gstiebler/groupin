import React from 'react';
import { List, ListItem } from 'react-native-elements'
import { SafeAreaView } from 'react-native';

export default GroupListComponent = ({ownGroups, selectGroup, navigation}) => {
  return (
    <SafeAreaView>
      <List containerStyle={{marginBottom: 20}}>
        {
          ownGroups.map((group) => (
            <ListItem
              roundAvatar
              avatar={{ uri: group.imgUrl }}
              key={group.id}
              title={group.name}
              onPress={() => { selectGroup(group.id); navigation.navigate('TopicsList'); } }
            />
          ))
        }
    </List>
   </SafeAreaView>
  );
}
