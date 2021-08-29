import * as _ from 'lodash';
import * as server from '../lib/server';


export class RootStore {
  userId = '';

  setUserIdAction = (userId: string) => { this.userId = userId; };

  async updateNotificationToken(notificationToken: string) {
    if (!this.userId) {
      throw new Error('There is no user yet');
    }
    await server.updateNotificationToken(notificationToken);
  }
}
