import { Navigation } from '../components/Navigator';
import * as server from '../lib/server';

export const createGroup = (params: { navigation: Navigation, groupName: string, visibility: boolean }) => async () => {
  const { navigation, groupName, visibility } = params;
  await server.createGroup({ groupName, visibility });
  navigation.goBack();
}
