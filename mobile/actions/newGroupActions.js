import * as server from '../lib/server';

export const createGroup = ({ navigation, groupName, visibility }) => async (/* dispatch, getState */) => {
  await server.createGroup({ groupName, visibility });
  navigation.goBack();
}
