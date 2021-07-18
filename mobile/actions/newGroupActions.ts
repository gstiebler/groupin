import { Navigation } from '../types/Navigator.types';
import * as server from '../lib/server';

export const createGroup = async (params: { navigation: Navigation, groupName: string, visibility: string }) => {
  const { navigation, groupName, visibility } = params;
  await server.createGroup({ groupName, visibility });
  navigation.goBack();
}
