import * as server from '../lib/server';

export const createGroup = (navigation, groupName) => async (dispatch, getState) => {
  await server.createGroup(groupName);
  navigation.goBack();
}
