import * as server from '../lib/server';

export const createGroup = async (params: { groupName: string, visibility: string }) => {
  const { groupName, visibility } = params;
  await server.createGroup({ groupName, visibility });
}
